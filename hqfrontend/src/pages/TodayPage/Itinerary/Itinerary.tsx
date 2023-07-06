import React, { useEffect, useState, useRef } from 'react'
import {
	Typography,
	Card,
	CardContent,
	Input,
	IconButton,
	Box,
	Grid,
	debounce,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import './Itinerary.css'
import bootstrap5Plugin from '@fullcalendar/bootstrap5';

// Full Calendar
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { EventInput } from '@fullcalendar/core'
import FullCalendar from '@fullcalendar/react'

// Components
import { addLengthToTime, currentLocalTime, getCurrentLocalDate } from '../../../components/DateFunctions'
import { useGlobalContext } from '../../App/GlobalContextProvider'
import EditInboxItemDialog from '../../../components/EditToDoItemDialog'
import ItineraryList from './ItineraryList'
import EditHabitDialog from '../../../components/EditHabitDialog'
import { formatTime, getHourBeforeCurrentTime, habitToEvent, toDoItemToEvent } from './ItineraryFunctions'


// Models
import Habit from "../../../models/habit"
import InboxItem, { UPDATE_TODO } from "../../../models/inboxitem"
import SimpleItem from "../../../models/simpleitem"
import HabitInboxRosetta from '../HabitInboxRosetta'

// Queries and Mutations
import { useMutation, useQuery } from '@apollo/client'
import { CHECK_UNCHECK_TODO } from '../../../models/inboxitem'
import { CHECK_HABIT } from '../../../models/habit'
import { ADD_TODO_TO_TODAY } from '../../../models/inboxitem'
import { GET_TO_DO_LIST_ITEMS_BY_START_DATE } from "../../../models/inboxitem"
import { GET_HABITS_DUE_TODAY } from "../../../models/habit"
import { UPDATE_DAILY_COMPLETION_PERCENTAGE } from '../../../models/accountability'



const Itinerary: React.FC = () => {
	const { setSnackbar, todayBadges, setTodayBadges } = useGlobalContext()

	const [inputValue, setInputValue] = useState('')
	const [uncompletedItems, setUncompletedItems] = useState<SimpleItem[]>([])
	const [completedItems, setCompletedItems] = useState<SimpleItem[]>([])
	const [habits, setHabits] = useState<Habit[]>([])
	const [inboxItems, setInboxItems] = useState<InboxItem[]>([])
	const [expanded, setExpanded] = useState(false)
	const [selectedInboxItemId, setSelectedInboxItemId] = useState<string | null>(null)
	const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null)
	const [scheduledNotifications, setScheduledNotifications] = useState<Record<string, boolean>>({})
	const [inboxEvents, setInboxEvents] = useState<EventInput[]>([])
	const [habitEvents, setHabitEvents] = useState<EventInput[]>([])

	// Calendar State
	const [events, setEvents] = useState<EventInput[]>([])
	const calendarRef = useRef(null)



	const localDate = getCurrentLocalDate()



	// Today's To Do Items Query
	const { loading: inboxLoading, error: inboxError, data: inboxData, refetch: inboxRefetch } = useQuery(GET_TO_DO_LIST_ITEMS_BY_START_DATE, {
		fetchPolicy: 'network-only',
		variables: {
			Today: localDate,
		},
		onCompleted: (data) => {
			const inboxItems = data.toDoItemsByStartDate.map((toDoItems: any) => {
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
					length: toDoItems.length,
				});
			});
			setInboxItems(inboxItems);

			// Convert inboxItems to events and update the state
			const newEvents = inboxItems.map(toDoItemToEvent).filter(Boolean);
			setInboxEvents(newEvents);
		},
		onError: (error) => {
			console.log(error);
		},
	});


	// Today's Habits Query
	const { loading: habitsLoading, error: habitsError, data: habitsData, refetch: habitsRefetch } = useQuery(GET_HABITS_DUE_TODAY, {
		fetchPolicy: 'network-only',
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
					habit.schedule.timeOfDay,
					habit.completedToday,
					habit.length,
				)
			})
			setHabits(habits)

			// Convert habits to events and update the state
			const newEvents = habits.map(habitToEvent).filter(Boolean)
			setHabitEvents(newEvents);
		},
		onError: (error) => {
			console.log(error)
		}
	})
	// Set up Simple Item Array
	useEffect(() => {
		if (habitsData && inboxData) {
			const combinedArray = HabitInboxRosetta({ habits: habits, inboxItems: inboxItems })

			const simpleItemArrayFiltered = combinedArray.filter((simpleItem) => {
				return !simpleItem.completedToday
			})

			// Sort uncompletedItems by startTime
			simpleItemArrayFiltered.sort((a, b) => {
				const aTime = a.startTime || ''
				const bTime = b.startTime || ''
				if (aTime < bTime) return -1
				if (aTime > bTime) return 1
				return 0
			})

			setUncompletedItems(simpleItemArrayFiltered)

			const simpleItemArrayCompleted = combinedArray.filter((simpleItem) => {
				return simpleItem.completedToday
			})
			setCompletedItems(simpleItemArrayCompleted)
		}
	}, [habitsData, inboxData, habits, inboxItems])


	useEffect(() => {
		if (habitEvents && inboxEvents) {
			const newEvents = [...habitEvents, ...inboxEvents]
			setEvents(newEvents)
		}
	}, [habitEvents, inboxEvents])


	// Calendar Logic
	const handleEventChange = debounce((changeInfo) => {

		// Find the index of the event that was changed
		const potentialItem1 = completedItems.findIndex(event => event.id === changeInfo.event.id)
		const potentialItem2 = uncompletedItems.findIndex(event => event.id === changeInfo.event.id)

		if (potentialItem1 === -1 && potentialItem2 === -1) {
			console.log('Event not found: ', changeInfo.event.id);
			return;
		}

		const confirmedItem = potentialItem1 === -1 ? uncompletedItems[potentialItem2] : completedItems[potentialItem1]

		// Calculate the length
		const differenceInMilliseconds = changeInfo.event.end - changeInfo.event.start;
		const differenceInMinutes = Math.floor(differenceInMilliseconds / 1000 / 60);
		const hours = Math.floor(differenceInMinutes / 60);
		const minutes = differenceInMinutes % 60;

		// Format the length to "hh:mm"
		const formattedLength = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

		try {
			updateInboxItem({
				variables: {
					// remove the last letter of the id
					ID: confirmedItem.id.slice(0, -1),
					Completed: confirmedItem.completedToday,
					Length: formattedLength,
					StartTime: formatTime(changeInfo.event.start),
				},
			})
			inboxRefetch()
		} catch (error) {
			console.log(error)
		}
	}, 100);

	const [updateInboxItem] = useMutation(UPDATE_TODO)
	const eventReceive = (info: any) => {
		console.log("Event Received")
		console.log(info)

		// Check if the title contains '|', if not set a default id and title
		if (!info.event.title.includes('|')) {
			info.event.setProp('id');
			info.event.setProp('title');
		} else {
			let [id, title] = info.event.title.split('|');

			// Set the id and title of the event
			info.event.setProp('id', id);
			info.event.setProp('title', title);
		}
		// Append the new event to the existing events
		setEvents([...events, {
			id: info.event.id,
			title: info.event.title,
			start: info.event.start,
			end: info.event.end
		}])
	}




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
			return
		}

		addTodoToToday({
			variables: {
				title: inputValue,
				startDate: getCurrentLocalDate(),
				Completed: false,
			},
			refetchQueries: [
				{ query: GET_TO_DO_LIST_ITEMS_BY_START_DATE, variables: { Today: localDate } },
				{ query: GET_HABITS_DUE_TODAY, variables: { Today: localDate } },
			],
			onCompleted: () => {
				setInputValue('')
				setSnackbar({
					message: "To Do Item Added",
					open: true,
					severity: "success"
				})
			}
		})
	}

	// Paste Event Handler
	const handlePaste = async (event: React.ClipboardEvent) => {
		event.preventDefault() // Prevent the paste from happening right away

		const pasteData = event.clipboardData.getData('text') // Get the data from the clipboard
		const lines = pasteData.split('\n') // Split the pasted data by new line

		if (lines.length > 1) { // If there are multiple lines
			if (!window.confirm(`You are about to create ${lines.length} to do items. Continue?`)) {
				return
			}
			for (const line of lines) {
				if (!line.trim()) { // If line is only whitespace
					continue
				}

				await addTodoToToday({
					variables: {
						title: line,
						startDate: getCurrentLocalDate(),
						Completed: false,
					},
				})
			}
			setSnackbar({
				message: "To Do Items Added",
				open: true,
				severity: "success"
			})
			inboxRefetch()
		} else { // If there is only one line
			setInputValue(pasteData) // Paste the data into the input field
		}
	}


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
			handleCheckHabit(item)
		} else {
			handleCheckToDo(item)
		}
	}
	// Check Habit
	const [checkHabit] = useMutation(CHECK_HABIT)
	const handleCheckHabit = async (habit: any) => {
		await checkHabit({
			variables: {
				// get rid of the h at the end of the id
				habitId: habit.id.slice(0, -1),
				currentDate: localDate,
			},
			onCompleted: () => {
				setSnackbar({
					message: "Habit completed!",
					open: true,
					severity: "success"
				})
				moveItemToCompleted(habit)
				updateBadge(habit)
			}
		})

	}
	// Check To Do
	const [checkToDo] = useMutation(CHECK_UNCHECK_TODO)
	const handleCheckToDo = async (todo: any) => {
		await checkToDo({
			variables: {
				// get rid of the h at the end of the id
				id: todo.id.slice(0, -1),
				Completed: true,
			},
			onCompleted: () => {
				setSnackbar({
					message: "Task completed!",
					open: true,
					severity: "success"
				})
				moveItemToCompleted(todo)
				updateBadge(todo)
			}
		})
	}
	// Update Badge
	const updateBadge = (item: any) => {
		const newArray = [...todayBadges] as [number | boolean, number | boolean];
		if (item.startTime < currentLocalTime() && !item.completedToday) {
			if (!item.length) {
				if (typeof newArray[1] === 'number') {
					newArray[1] = newArray[1] - 1;
				}
			} else {
				if (addLengthToTime(item.startTime, item.length) > currentLocalTime()) {
					if (typeof newArray[0] === 'number') {
						newArray[0] = newArray[0] - 1;
					}
				} else {
					if (typeof newArray[1] === 'number') {
						newArray[1] = newArray[1] - 1;
					}
				}
			}

		}
		if (newArray[0] === 0) {
			newArray[0] = false;
		}
		if (newArray[1] === 0) {
			newArray[1] = false;
		}
		setTodayBadges(newArray);
	}
	// Move Item
	const moveItemToCompleted = (moveItem: SimpleItem) => {
		// FINISHLATER: If you check off an inbox item after a few habits then it'll reset the arrays to an earlier state for some reason
		// setUncompletedItems((prevArray: SimpleItem[]) =>
		// 	prevArray.filter((item) => item.id !== moveItem.id)
		// )
		// setCompletedItems((prevArray: SimpleItem[]) =>
		// 	[...prevArray, { id: moveItem.id, type: moveItem.type, completedToday: true, title: moveItem.title }]
		// )
		inboxRefetch()
		habitsRefetch()
	}
	// useEffect(() => {
	// 	console.log(uncompletedItems);
	// }, [uncompletedItems]);
	
	// useEffect(() => {
	// 	console.log(completedItems);
	// }, [completedItems]);





	// Dialog Close Handlers
	const handleCloseInbox = () => {
		setSelectedInboxItemId(null)
		inboxRefetch()
	}
	const handleCloseHabit: any = () => {
		setSelectedHabitId(null)
		habitsRefetch()
	}




	// Notification Stuff
	// Notification Request
	Notification.requestPermission().then(function (permission) {
		if (permission !== "granted") {
			console.error("Notification permission not granted.")
		}
	})

	// Use useEffect to schedule notifications for all tasks
	useEffect(() => {
		// Assuming 'habits' and 'inboxItems' are arrays of your tasks
		const scheduleNotification = (item: any) => {
			const now = new Date()
			const date = new Date() // today's date
			const dateString = date.toISOString().split('T')[0] // get the date string in the format of "yyyy-mm-dd"
			const taskTime = new Date(dateString + 'T' + item.startTime)

			if (taskTime > now && !scheduledNotifications[item.id]) {
				const delay = taskTime.getTime() - now.getTime() // Convert dates to milliseconds before subtracting
				setTimeout(() => {
					new Notification(`Time to start item: ${item.title}`)
				}, delay)
				setScheduledNotifications(prevState => ({ ...prevState, [item.id]: true }))
			}
		}

		if (Notification.permission !== "granted") {
			console.error("Notification permission not granted.")
		} else {
			uncompletedItems.forEach(scheduleNotification)
		}
	}, [uncompletedItems, scheduledNotifications])



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
			<Grid
				container
				spacing={2}
				style={{ height: '80vh', overflow: 'auto' }}
			>


				{/* Calendar */}
				<Grid item xs={12} md={6} order={{ xs: 2, md: 1 }} style={{ height: '100%', overflowY: 'auto' }}>

					<FullCalendar
						ref={calendarRef}
						plugins={[timeGridPlugin, interactionPlugin, bootstrap5Plugin]}
						themeSystem='standard'
						initialView="timeGridDay"
						weekends={true}
						headerToolbar={false}
						nowIndicator={true}
						scrollTime={getHourBeforeCurrentTime()}
						height="100%"
						contentHeight="100%"
						droppable={true}
						eventReceive={eventReceive}
						events={events}
						eventChange={handleEventChange}
						editable={true}
						slotMaxTime="26:00:00"
					/>

				</Grid>


				{/* Itinerary */}
				<Grid item xs={12} md={6} order={{ xs: 1, md: 2 }} style={{ height: '100%', overflowY: 'auto' }}>
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
										handleAddItem()
									}
								}}
							/>
							<IconButton onClick={handleAddItem}>
								<AddIcon />
							</IconButton>
						</Box>

						<Box>
							{/* Itinerary List */}
							{uncompletedItems.length > 0 ? (
								<ItineraryList
									list={uncompletedItems}
									setSelectedInboxItemId={setSelectedInboxItemId}
									setSelectedHabitId={setSelectedHabitId}
									handleCheckItem={handleCheckItem}
								/>
							) : (
								completedItems.length > 0 ? (
									<Typography variant="h6" align="center" color="textSecondary">
										All done. Good job!
									</Typography>
								) : (
									<Typography variant="h6" align="center" color="textSecondary">
										No items
									</Typography>
								)
							)}

						</Box>
					</CardContent>


					{/* Completed Items */}
					<Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
						<AccordionSummary expandIcon={<ExpandMoreIcon />}>
							<Typography variant="h6">Completed Items</Typography>
						</AccordionSummary>
						<AccordionDetails>
							{completedItems.length > 0 ? (
								<ItineraryList
									list={completedItems}
									setSelectedInboxItemId={setSelectedInboxItemId}
									setSelectedHabitId={setSelectedHabitId}
									handleCheckItem={handleCheckItem}
								/>
							) : (
								<Typography variant="h6" align="center" color="textSecondary">
									No completed items
								</Typography>
							)}
						</AccordionDetails>
					</Accordion>


					{selectedInboxItemId && <EditInboxItemDialog handleClose={handleCloseInbox} inboxItemId={selectedInboxItemId} />}
					{selectedHabitId && <EditHabitDialog onClose={handleCloseHabit} habitId={selectedHabitId} />}

				</Grid>
			</Grid>
		</Card>
	)


}

export default Itinerary
