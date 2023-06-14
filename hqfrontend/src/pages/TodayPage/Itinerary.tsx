import React, { useEffect, useState } from 'react';
import {
	List,
	ListItem,
	ListItemText,
	Typography,
	Card,
	CardContent,
	Checkbox,
	Input,
	IconButton,
	Box,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


// Components
import { getCurrentLocalDate } from '../../components/DateFunctions';
import { useGlobalContext } from '../App/GlobalContextProvider';
import EditInboxItemDialog from '../../components/EditToDoItemDialog';


// Models
import Habit from "../../models/habit";
import InboxItem from "../../models/inboxitem";
import SimpleItem from "../../models/simpleitem";
import HabitInboxRosetta from './HabitInboxRosetta';

// Queries and Mutations
import { useMutation, useQuery } from '@apollo/client';
import { CHECK_UNCHECK_TODO } from '../../models/inboxitem';
import { CHECK_HABIT } from '../../models/habit';
import { ADD_TODO_TO_TODAY } from '../../models/inboxitem';
import { GET_TODAY_LIST_ITEMS } from "../../models/inboxitem";
import { GET_HABITS_DUE_TODAY } from "../../models/habit";
import { UPDATE_DAILY_COMPLETION_PERCENTAGE } from '../../models/accountability';



const Itinerary: React.FC = () => {
	const { setSnackbar } = useGlobalContext();

	const [inputValue, setInputValue] = useState('');
	const [uncompletedItems, setUncompletedItems] = useState<SimpleItem[]>([]);
	const [completedItems, setCompletedItems] = useState<SimpleItem[]>([]);
	const [habits, setHabits] = useState<Habit[]>([]);
	const [inboxItems, setInboxItems] = useState<InboxItem[]>([]);
	const [expanded, setExpanded] = useState(false);
	const [selectedInboxItemId, setSelectedInboxItemId] = useState<string | null>(null);



	const localDate = getCurrentLocalDate();


	// Today's To Do Items Query
	const { loading: inboxLoading, error: inboxError, data: inboxData, refetch: inboxRefetch } = useQuery(GET_TODAY_LIST_ITEMS, {
		fetchPolicy: 'network-only',
		variables: {
			Today: localDate,
		},
		onCompleted: (data) => {
			const inboxItems = data.toDoItems.map((toDoItems: any) => {
				return new InboxItem({
					id: toDoItems.id,
					title: toDoItems.title,
					description: toDoItems.description,
					completed: toDoItems.completed,
					project: toDoItems.project,
					dueDateTime: toDoItems.dueDateTime,
					startDate: toDoItems.startDate,
					startTime: toDoItems.startTime,
					timeCompleted: new Date(toDoItems.timeCompleted),
				})
			})
			setInboxItems(inboxItems)
		}
	});


	// Today's Habits Query
	const { loading: habitsLoading, error: habitsError, data: habitsData } = useQuery(GET_HABITS_DUE_TODAY, {
		variables: { today: localDate },
		onCompleted: (data) => {
			const habits = data.habitsDueToday.map((habit: any) => {
				return new Habit(
					habit.id,
					habit.title,
					habit.active,
					habit.frequency,
					habit.lastCompleted,
					habit.order,
					habit.daysOfTheWeek,
					habit.daysOfTheMonth,
					habit.dayOfTheYear,
					habit.startDate,
					habit.endDate,
					habit.timeOfDay,
					habit.completedToday,
				);
			});
			setHabits(habits);
		},
		onError: (error) => {
			console.log(error)
		}
	});


	// Set up Simple Item Array
	useEffect(() => {
		if (habitsData && inboxData) {
			const combinedArray = HabitInboxRosetta({ habits: habits, inboxItems: inboxItems })

			const simpleItemArrayFiltered = combinedArray.filter((simpleItem) => {
				return !simpleItem.completedToday
			})

			// Sort uncompletedItems by startTime
			simpleItemArrayFiltered.sort((a, b) => {
				const aTime = a.startTime || '';
				const bTime = b.startTime || '';
				if (aTime < bTime) return -1;
				if (aTime > bTime) return 1;
				return 0;
			});

			setUncompletedItems(simpleItemArrayFiltered)

			const simpleItemArrayCompleted = combinedArray.filter((simpleItem) => {
				return simpleItem.completedToday
			})
			setCompletedItems(simpleItemArrayCompleted)
		}
	}, [habitsData, inboxData, habits, inboxItems])



	// Add To Do Item
	const [addTodoToToday] = useMutation(ADD_TODO_TO_TODAY)
	const handleAddItem = () => {

		// Error Handling
		if (!inputValue.trim()) {
			setSnackbar({
				message: "Please enter a title",
				open: true,
				severity: "error"
			})
			return;
		}

		addTodoToToday({
			variables: {
				title: inputValue,
				startDate: getCurrentLocalDate(),
				Completed: false,
			},
			refetchQueries: [
				{ query: GET_TODAY_LIST_ITEMS, variables: { Today: localDate } },
			],
			onCompleted: () => {
				setInputValue('');
				setSnackbar({
					message: "To Do Item Added",
					open: true,
					severity: "success"
				})
			}
		})
	};


	// Paste Event Handler
	const handlePaste = async (event: React.ClipboardEvent) => {
		event.preventDefault(); // Prevent the paste from happening right away

		const pasteData = event.clipboardData.getData('text'); // Get the data from the clipboard
		const lines = pasteData.split('\n'); // Split the pasted data by new line

		if (lines.length > 1) { // If there are multiple lines
			if (!window.confirm(`You are about to create ${lines.length} to do items. Continue?`)) {
				return;
			}
			for (const line of lines) {
				if (!line.trim()) { // If line is only whitespace
					continue;
				}

				await addTodoToToday({
					variables: {
						title: line,
						startDate: getCurrentLocalDate(),
						Completed: false,
					},
				});
			}
			setSnackbar({
				message: "To Do Items Added",
				open: true,
				severity: "success"
			})
			inboxRefetch();
		} else { // If there is only one line
			setInputValue(pasteData); // Paste the data into the input field
		}
	};


	// Check Item
	const [updateDailyCompletionPercentage] = useMutation(UPDATE_DAILY_COMPLETION_PERCENTAGE)
	const handleUpdateDailyCompletionPercentage = async () => {
		const totalTasks = uncompletedItems.length + completedItems.length
		const completedTasks = completedItems.length + 1
		await updateDailyCompletionPercentage({
			variables: {
				Date: getCurrentLocalDate(),
				TotalTasks: totalTasks,
				CompletedTasks: completedTasks,
			},
		})
	}
	const handleCheckItem = (item: SimpleItem) => {
		handleUpdateDailyCompletionPercentage()
		if (item.type === 'habit') {
			handleCheckHabit(item.id)
		} else {
			handleCheckToDo(item.id)
		}
	}

	// Check Habit
	const [checkHabit] = useMutation(CHECK_HABIT)
	const handleCheckHabit = async (habitId: string) => {
		await checkHabit({
			variables: {
				// get rid of the h at the end of the id
				habitId: habitId.slice(0, -1),
				currentDate: getCurrentLocalDate(),
			},
		})

		setUncompletedItems((prevArray: SimpleItem[]) =>
			// remove the item from the array
			prevArray.filter((item) => item.id !== habitId && item.type === 'habit' && !item.completedToday)
		)
	}

	// Check To Do
	const [checkToDo] = useMutation(CHECK_UNCHECK_TODO)
	const handleCheckToDo = async (todoId: string) => {
		await checkToDo({
			variables: {
				// get rid of the h at the end of the id
				id: todoId.slice(0, -1),
				Completed: true,
			},
			onCompleted: () => {
				setSnackbar({
					message: "Task completed!",
					open: true,
					severity: "success"
				})
				inboxRefetch();
			}
		})
	}


	const handleClose = (removed?: boolean) => {
		if (removed) {
			// find the item in the array
			const item = uncompletedItems.find((item) => item.id === selectedInboxItemId + 'i')
			if (item) {
				// remove the item from the array
				setUncompletedItems((prevArray: SimpleItem[]) =>
					prevArray.filter((item) => item.id !== selectedInboxItemId + 'i')
				)
			}
			const completedItem = completedItems.find((item) => item.id === selectedInboxItemId + 'i')
			if (completedItem) {
				// remove the item from the array
				setCompletedItems((prevArray: SimpleItem[]) =>
					prevArray.filter((item) => item.id !== selectedInboxItemId + 'i')
				)
			}
		} 
		setSelectedInboxItemId(null)
	};



	if (inboxLoading || habitsLoading) return <p>Loading...</p>
	if (inboxError || habitsError) return <p>Error :(</p>




	return (
		<Card
			sx={{
				borderRadius: 2,
				boxShadow: 2,
				marginRight: 2,
				padding: 1,
			}}
		>
			<CardContent>
				<Typography variant="h5" gutterBottom>
					Itinerary
				</Typography>

				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						marginBottom: 2,
					}}
				>

					{/* To Do Input */}
					<Input
						placeholder="Add item"
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
						onPaste={handlePaste}
						fullWidth
						inputProps={{ style: { paddingLeft: "5px" } }}
						onKeyDown={(e) => {
							if (e.key === 'Enter') {
								handleAddItem();
							}
						}}
					/>
					<IconButton onClick={handleAddItem}>
						<AddIcon />
					</IconButton>
				</Box>

				<Box
					sx={{
						maxHeight: '90%',
						overflow: 'auto',
						'&::-webkit-scrollbar': {
							width: '0.4em'
						},
						'&::-webkit-scrollbar-track': {
							boxShadow: 'inset 0 0 6px rgba(0, 0, 0, 0.00)',
							webkitBoxShadow: 'inset 0 0 6px rgba(0, 0, 0, 0.00)'
						},
						'&::-webkit-scrollbar-thumb': {
							backgroundColor: 'rgba(0,0,0,.1)',
							outline: '1px solid slategrey'
						}
					}}
				>

					{/* Itinerary List */}
					{uncompletedItems.length > 0 ? (
						<List sx={{ padding: 0 }}>
							{uncompletedItems.map((item) => (
								<ListItem key={item.id} disablePadding>
									<Checkbox
										checked={item.completedToday}
										onChange={() => handleCheckItem(item)}
									/>
									<ListItemText
										primary={item.title}
										// cut off the last 3 characters of time to remove minutes
										secondary={item.startTime?.slice(0, -3)}
										onClick={() => {
											if ("i" === item.id.slice(-1)) {
												setSelectedInboxItemId(item.id.slice(0, -1))
											}
										}}
									/>
								</ListItem>
							))}
						</List>
					) : (
						<Typography variant="h6" align="center" color="textSecondary">
							Nothing left to do
						</Typography>
					)}

				</Box>
			</CardContent>

			<Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
				<AccordionSummary expandIcon={<ExpandMoreIcon />}>
					<Typography variant="h6">Completed Items</Typography>
				</AccordionSummary>
				<AccordionDetails>
					{completedItems.length > 0 ? (
						<List sx={{ padding: 0 }}>
							{completedItems.map((item) => (
								<ListItem key={item.id} disablePadding>
									<Checkbox
										checked={item.completedToday}
										disabled
									/>
									<ListItemText
										primary={item.title}
										secondary={item.startTime?.slice(0, -3)}
										onClick={() => {
											if ("i" === item.id.slice(-1)) {
												setSelectedInboxItemId(item.id.slice(0, -1))
											}
										}}
									/>
								</ListItem>
							))}
						</List>
					) : (
						<Typography variant="h6" align="center" color="textSecondary">
							No completed items
						</Typography>
					)}
				</AccordionDetails>
			</Accordion>


			{selectedInboxItemId && <EditInboxItemDialog handleClose={handleClose} inboxItemId={selectedInboxItemId} />}

		</Card>
	);


};

export default Itinerary;
