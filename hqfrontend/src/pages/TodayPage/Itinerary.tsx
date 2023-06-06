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


// Models
import Habit from "../../models/habit";
import InboxItem from "../../models/inboxitem";
import SimpleItem from "../../models/simpleitem";
import HabitInboxRosetta from './HabitInboxRosetta';

// Queries and Mutations
import { useMutation, useQuery } from '@apollo/client';
import { CHECK_UNCHECK_TODO } from '../../models/inboxitem';
import { CHECK_HABIT } from '../../models/habit';
import { ADD_LOG } from '../../models/log';
import { ADD_TODO_TO_TODAY } from '../../models/inboxitem';
import { GET_TODAY_LIST_ITEMS } from "../../models/inboxitem";
import { GET_HABITS_DUE_TODAY } from "../../models/habit";



const Itinerary: React.FC = () => {
	const { setSnackbar } = useGlobalContext();

	const [inputValue, setInputValue] = useState('');
	const [uncompletedItems, setUncompletedItems] = useState<SimpleItem[]>([]);
	const [completedItems, setCompletedItems] = useState<SimpleItem[]>([]);
	const [habits, setHabits] = useState<Habit[]>([]);
	const [inboxItems, setInboxItems] = useState<InboxItem[]>([]);
	const [expanded, setExpanded] = useState(false);


	const localDate = getCurrentLocalDate();


	// Today's To Do Items Query
	const { loading: inboxLoading, error: inboxError, data: inboxData, refetch: inboxRefetch } = useQuery(GET_TODAY_LIST_ITEMS, {
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
	const {
		loading: habitsLoading,
		error: habitsError,
		data: habitsData,
		refetch: habitsRefetch,
	} = useQuery(GET_HABITS_DUE_TODAY, {
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
		if (!inputValue.trim()) {
			setSnackbar({
				message: "Please enter a title",
				open: true,
				severity: "error"
			})
			return;
		}
		const newItem: SimpleItem = {
			id: String(Date.now()) + 'i',
			title: inputValue,
			startTime: '',
			type: 'inbox',
			completedToday: false,
		};
		setUncompletedItems((prevArray: SimpleItem[]) => [...prevArray, newItem]);
		addTodoToToday({
			variables: {
				title: newItem.title,
				startDate: getCurrentLocalDate(),
				Completed: false,
			},
		}).then(() => {
			setInputValue('');
			inboxRefetch();
		});
	};

	// Check Item
	const handleCheckItem = (item: SimpleItem) => {
		if (item.type === 'habit') {
			handleCheckHabit(item.id)
		} else {
			handleCheckToDo(item.id)
		}
	}

	// Check Habit
	const [checkHabit] = useMutation(CHECK_HABIT)
	const [addHabitLog] = useMutation(ADD_LOG)
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

		await addHabitLog({
			variables: {
				logTime: new Date().toISOString(),
				habitId: habitId.slice(0, -1),
			},
		})
	}

	// Check To Do
	const [checkToDo] = useMutation(CHECK_UNCHECK_TODO)
	const [addToDoLog] = useMutation(ADD_LOG)
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
			}
		})

		setUncompletedItems((prevArray: any[]) =>
			prevArray.filter((item) => item.id !== todoId && item.type === 'todo' && !item.completedToday)
		)

		await addToDoLog({
			variables: {
				logTime: new Date().toISOString(),
				todoItemId: todoId.slice(0, -1),
			},
		})
	}



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

				{/* Input Box */}
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						marginBottom: 2,
					}}
				>
					<Input
						placeholder="Add item"
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
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

				{/* List */}
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
										secondary={item.startTime}
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
										secondary={item.startTime}
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


		</Card>
	);


};

export default Itinerary;
