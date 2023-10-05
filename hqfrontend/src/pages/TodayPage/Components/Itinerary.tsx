import React, { useEffect, useState, useRef } from 'react'
import { Typography, Card, CardContent, Input, IconButton, Box, Grid, debounce } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import { useMutation, useQuery } from '@apollo/client'

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
import { formatTime, getHourBeforeCurrentTime, habitToEvent, toDoItemToEvent } from '../Functions/ItineraryFunctions'
import { sortObjectsByIds } from '../../../components/MiscFunctions'
import { updateRitualHistoryWithRepeatRituals } from '../../../models/ritual'
import { RitualHistoryManager } from '../../../models/ritual'

// Models
import Habit from "../../../models/habit"
import InboxItem from "../../../models/inboxitem"
import Ritual from "../../../models/ritual"
import SimpleItem, { habitsToSimpleItems, inboxItemsToSimpleItems, ritualsToSimpleItems } from "../../../models/simpleitem"

// Queries 
import { ITINERARY_QUERY } from '../../../models/inboxitem'
// Mutations
import { UPDATE_TODO } from '../../../models/inboxitem'
import { CHECK_UNCHECK_TODO } from '../../../models/inboxitem'
import { ADD_TODO_TO_TODAY } from '../../../models/inboxitem'
import { UPDATE_OR_CREATE_ITINERARY_ORDER } from '../../../models/settings';
import { CHECK_HABIT } from '../../../models/habit'
import { UPDATE_DAILY_COMPLETION_PERCENTAGE } from '../../../models/accountability'
import RitualDialog from '../../../components/RitualDialog'
import Schedule from '../../../models/schedule'
import AccountabilityToDoListDisplay from './AccountabilityToDoListDisplay'

type ItemType = {
	title: string;
	checked: boolean;
};

const Itinerary: React.FC = () => {
	const { setSnackbar, todayBadges, setTodayBadges, setDebugText } = useGlobalContext()!

	const [inputValue, setInputValue] = useState('')
	const [uncompletedItems, setUncompletedItems] = useState<SimpleItem[]>([])
	const [completedItems, setCompletedItems] = useState<SimpleItem[]>([])
	const [simpleItems, setSimpleItems] = useState<any[]>([])
	const [expanded, setExpanded] = useState(false)
	const [selectedInboxItemId, setSelectedInboxItemId] = useState<string | null>(null)
	const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null)
	const [selectedRitualId, setSelectedRitualId] = useState<string | null>(null)
	const [selectedEntryID, setSelectedEntryID] = useState<any>(null)
	const [scheduledNotifications, setScheduledNotifications] = useState<Record<string, boolean>>({})
	const [orderIds, setOrderIds] = useState<string[]>([])
	const [ritualHistory, setRitualHistory] = useState<RitualHistoryManager>(new RitualHistoryManager())
	const [events, setEvents] = useState<EventInput[] | []>([]);
	const calendarRef = useRef(null)

	const localDate = getCurrentLocalDate()




	// Query
	const { loading, error, data, refetch } = useQuery(ITINERARY_QUERY, {
		fetchPolicy: 'network-only',
		variables: {
			Today: localDate,
			YearMonth: localDate.slice(0, 7),
		},
		onCompleted: (data) => {

			// Set inbox items
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


			// Set habit items
			const habits = data.habitsDueToday.map((habit: any) => {

				const schedule = new Schedule({
					frequency: habit.schedule.frequency,
					daysOfTheWeek: habit.schedule.daysOfTheWeek,
					daysOfTheMonth: habit.schedule.daysOfTheMonth,
					dayOfTheYear: habit.schedule.daysOfTheYear,
					startDate: habit.schedule.startDate,
					endDate: habit.schedule.endDate,
					timeOfDay: habit.schedule.timeOfDay,
				})

				return new Habit({
					id: habit.id,
					title: habit.title,
					active: habit.active,
					length: habit.length,
					schedule: schedule,
					countToday: habit.countToday,
				});
			})


			// Set rituals
			const rituals = data.rituals.map((ritual: any) => {
				return new Ritual({
					ritualID: ritual.id,
					title: ritual.title,
					habits: ritual.habits,
					ritual_items: ritual.ritual_items,
					schedule: ritual.schedule
				});
			})

			// Filter out rituals that are not daily
			const filteredRituals = rituals.filter((ritual: any) => {
				return ritual.schedule.frequency === "DAILY";
			});


			// 3. Initialize and populate RitualHistoryManager
			const updatedRitualHistory = ritualHistory
			data.ritualHistory && data.ritualHistory.data &&
				updatedRitualHistory.fromJson(data.ritualHistory.data)


			// 4. Update state
			setRitualHistory(updatedRitualHistory);

			// 5. Update ritual history with repeat rituals
			// Make sure that updateRitualHistoryWithRepeatRituals returns updated rituals
			const updatedRituals = updateRitualHistoryWithRepeatRituals(filteredRituals, ritualHistory, localDate);


			// 6. Convert to simple items
			const simpleRitualItems = ritualsToSimpleItems(updatedRituals, data.rituals)





			// Set order
			const orderData = JSON.parse(data.settings.itineraryOrder)
			const orderIds = orderData.ids
			const orderDate = orderData.date


			setOrderIds(orderIds)


			// Combine the inbox items and habits into one array
			const simpleHabitItems = habitsToSimpleItems(habits)
			const simpleInboxItems = inboxItemsToSimpleItems(inboxItems)

			const combinedArray = [...simpleInboxItems, ...simpleHabitItems, ...simpleRitualItems]
			setSimpleItems(combinedArray)



			const simpleItemArrayFiltered = combinedArray.filter((simpleItem: any) => {
				return !simpleItem.completedToday
			})

			if (orderDate === getCurrentLocalDate() && orderIds.length > 0) {
				const sortedArray = sortObjectsByIds(simpleItemArrayFiltered, orderIds);
				setUncompletedItems(sortedArray as SimpleItem[]);
			} else {
				// If the order date is not today, update the order with today's date and the IDs of the uncompleted items
				const newOrderIds = simpleItemArrayFiltered.map(item => item.id);
				setOrderIds(newOrderIds);

				// Sort uncompletedItems by startTime
				simpleItemArrayFiltered.sort((a: any, b: any) => {
					const aTime = a.startTime || '';
					const bTime = b.startTime || '';
					if (aTime < bTime) return -1;
					if (aTime > bTime) return 1;
					return 0;
				});
				setUncompletedItems(simpleItemArrayFiltered);
			}




			const simpleItemArrayCompleted = combinedArray.filter((simpleItem: any) => {
				return simpleItem.completedToday
			})
			setCompletedItems(simpleItemArrayCompleted)




			// Calendar Stuff
			const newInboxEvents = inboxItems.map(toDoItemToEvent).filter(Boolean);
			const newHabitEvents = habits.map(habitToEvent).filter(Boolean)
			const newEvents = [...newInboxEvents, ...newHabitEvents]
			setEvents(newEvents)



		},
		onError: (error) => {
			console.log(error);
		},
	})



	// Debug Panel
	// interface Dependencies {
	// 	localDate: any;
	// 	todayBadges: any;
	// 	uncompletedItems: any;
	// 	completedItems: any;
	// 	expanded: any;
	// 	selectedInboxItemId: any;
	// 	selectedHabitId: any;
	// 	scheduledNotifications: any;
	// 	events: any;
	// 	calendarRef: any;
	// 	orderIds: any;
	// 	data: any;
	// 	simpleItems: any;
	// 	ritualHistory: any;
	// }
	// const prevDeps = useRef<Dependencies>({
	// 	localDate: undefined,
	// 	todayBadges: undefined,
	// 	uncompletedItems: undefined,
	// 	completedItems: undefined,
	// 	expanded: undefined,
	// 	selectedInboxItemId: undefined,
	// 	selectedHabitId: undefined,
	// 	scheduledNotifications: undefined,
	// 	events: undefined,
	// 	calendarRef: undefined,
	// 	orderIds: undefined,
	// 	data: undefined,
	// 	simpleItems: undefined,
	// 	ritualHistory: undefined,
	// });
	useEffect(() => {
		// const changedDeps: string[] = [];

		// const currentDeps: Dependencies = {
		// 	localDate,
		// 	todayBadges,
		// 	uncompletedItems,
		// 	completedItems,
		// 	expanded,
		// 	selectedInboxItemId,
		// 	selectedHabitId,
		// 	scheduledNotifications,
		// 	events,
		// 	calendarRef,
		// 	orderIds,
		// 	data,
		// 	simpleItems,
		// 	ritualHistory,
		// };

		// Object.entries(currentDeps).forEach(([key, value]) => {
		// 	if (key !== 'calendarRef') {
		// 		if (JSON.stringify(prevDeps.current[key as keyof Dependencies]) !== JSON.stringify(value)) {
		// 			changedDeps.push(key);
		// 			prevDeps.current[key as keyof Dependencies] = value;
		// 		}
		// 	}
		// });


		// if (changedDeps.length > 0) {
		// 	console.log(`Changed dependencies: ${changedDeps.join(", ")}`);
		// }


		setDebugText([
			{ title: "Today's Date", content: localDate },
			{ title: "Order Ids", content: JSON.stringify(orderIds, null, 2) },
			{ title: "Current Time", content: currentLocalTime() },
			{ title: "Today's Badges", content: JSON.stringify(todayBadges, null, 2) },
			{ title: "Uncompleted Items", content: JSON.stringify(uncompletedItems, null, 2) },
			{ title: "Completed Items", content: JSON.stringify(completedItems, null, 2) },
			{ title: "Expanded", content: JSON.stringify(expanded, null, 2) },
			{ title: "Selected Inbox Item Id", content: JSON.stringify(selectedInboxItemId, null, 2) },
			{ title: "Selected Habit Id", content: JSON.stringify(selectedHabitId, null, 2) },
			{ title: "Scheduled Notifications", content: JSON.stringify(scheduledNotifications, null, 2) },
			{ title: "Events", content: JSON.stringify(events, null, 2) },
			{ title: "Data", content: JSON.stringify(data, null, 2) },
			{ title: "SimpleItems", content: JSON.stringify(simpleItems, null, 2) },
			{ title: "Ritual History", content: JSON.stringify(ritualHistory, null, 2) },
		])
	}, [
		setDebugText,
		localDate,
		todayBadges,
		uncompletedItems,
		completedItems,
		expanded,
		selectedInboxItemId,
		selectedHabitId,
		scheduledNotifications,
		events,
		calendarRef,
		orderIds,
		data,
		simpleItems,
		ritualHistory,
	])







	// Update Order
	const [updateOrCreateItineraryOrder] = useMutation(UPDATE_OR_CREATE_ITINERARY_ORDER)
	useEffect(() => {
		if (uncompletedItems.length > 0) {
			const ids = uncompletedItems.map((item) => item.id);
			const date = getCurrentLocalDate();
			const order = JSON.stringify({ date, ids });

			updateOrCreateItineraryOrder({
				variables: {
					itineraryOrder: order,
				},
				onError: (error) => {
					console.log(error);
				}
			});
		}
	}, [uncompletedItems, updateOrCreateItineraryOrder]);





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
				}
			})
		} catch (error) {
			console.log(error)
		}
	}, 100);






	// Calendar Stuff
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
			setSnackbar({ message: "Please enter a title", open: true, severity: "error" })
			return
		}

		// Add inbox item mutation
		addTodoToToday({
			variables: {
				title: inputValue,
				startDate: getCurrentLocalDate(),
				Completed: false,
			},
			onCompleted: () => {
				setInputValue('')
				setSnackbar({ message: "To Do Item Added", open: true, severity: "success" })
				refetch()
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
		} else { // If there is only one line
			setInputValue(inputValue + pasteData) // Paste the data into the input field
		}
	}




	// Check Item
	const handleCheckItem = (item: SimpleItem) => {
		if (item.type === 'habit') {
			handleCheckHabit(item)
		} else {
			handleCheckToDo(item)
		}
	}
	// Check Habit
	const [checkHabit] = useMutation(CHECK_HABIT)
	const handleCheckHabit = async (habit: any) => {
		const newQuantity = habit.completedToday ? -1 : 1;

		await checkHabit({
			variables: {
				// get rid of the h at the end of the id
				habitId: habit.id.slice(0, -1),
				currentDate: localDate,
				quantity: Math.max(0, newQuantity),  // ensure quantity doesn't go below zero
			},
			onCompleted: () => {
				setSnackbar({
					message: "Habit completed!",
					open: true,
					severity: "success"
				})
				updateBadge(habit)
				refetch()
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
				Completed: !todo.completedToday,
			},
			onCompleted: () => {
				setSnackbar({
					message: `Task ${todo.completedToday ? 'unchecked' : 'checked'}!`,
					open: true,
					severity: "success"
				})
				updateBadge(todo)
			}
		})
	}


	// Update Daily Completion Percentage
	const [updateDailyCompletionPercentage] = useMutation(UPDATE_DAILY_COMPLETION_PERCENTAGE)
	// Use Effect for item changes
	useEffect(() => {

		// Create list
		const createList = (): ItemType[] => {
			const finalList: ItemType[] = [];

			// Add completed items
			for (const item of completedItems) {
				finalList.push({
					title: item.title,
					checked: true,
				});
			}

			// Add uncompleted items
			for (const item of uncompletedItems) {
				finalList.push({
					title: item.title,
					checked: false,
				});
			}

			return finalList;
		};

		const list = createList();
		const jsonString = JSON.stringify(list);

		const totalTasks = uncompletedItems.length + completedItems.length
		const completedTasks = completedItems.length + 1
		updateDailyCompletionPercentage({
			variables: {
				Date: getCurrentLocalDate(),
				TotalTasks: totalTasks,
				CompletedTasks: completedTasks,
				TasksList: jsonString,
			},
		})


	}, [completedItems])





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





	// Dialog Close Handlers
	const handleCloseInbox = () => {
		setSelectedInboxItemId(null)
	}
	const handleCloseHabit: any = () => {
		setSelectedHabitId(null)
	}
	const handleCloseRitual: any = () => {
		setSelectedRitualId(null)
		setSelectedEntryID(null)
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



	if (loading) return <p>Loading...</p>
	if (error) return <p>Error :(</p>

	return (
		<>
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
							slotMaxTime="27:00:00"
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

							{/* Itinerary List */}
							<Box>
								{uncompletedItems.length > 0 ? (
									<ItineraryList
										list={uncompletedItems}
										setList={setUncompletedItems}
										setSelectedInboxItemId={setSelectedInboxItemId}
										setSelectedHabitId={setSelectedHabitId}
										setSelectedRitualId={setSelectedRitualId}
										setSelectedEntryID={setSelectedEntryID}
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
										setList={setCompletedItems}
										setSelectedInboxItemId={setSelectedInboxItemId}
										setSelectedHabitId={setSelectedHabitId}
										setSelectedRitualId={setSelectedRitualId}
										setSelectedEntryID={setSelectedEntryID}
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
						{selectedRitualId &&
							<RitualDialog
								open={true}
								onClose={handleCloseRitual}
								ritualId={selectedRitualId}
								entryID={selectedEntryID}
								entryDate={getCurrentLocalDate()}
								ritualHistory={ritualHistory}
								setRitualHistory={setRitualHistory}
							/>}

					</Grid>



				</Grid>
			</Card>

			{/* Spacer */}
			<Box sx={{ height: 30 }} />

			{/* Accounability Display */}
			<AccountabilityToDoListDisplay />
		</>
	)


}

export default Itinerary
