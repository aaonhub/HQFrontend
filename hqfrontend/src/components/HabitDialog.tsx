import React, { useEffect, useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import { useMutation, useQuery } from '@apollo/client'
import CustomList from './CustomChecklist'
import useSound from 'use-sound'
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

// Components
import { useGlobalContext } from '../pages/App/GlobalContextProvider'
import EditRitualDialog from './EditRitualDialog'

// Sounds
import complete from '../sounds/complete.wav'
import confirmation from '../sounds/confirmation.mp3'

// Queries and mutations
import { UPDATE_RITUAL, DELETE_RITUAL, GET_RITUAL, UPDATE_RITUAL_HISTORY, RitualHistoryManager, RitualEntry, RitualStatus, GET_RITUAL_AND_RITUAL_HISTORY } from '../models/ritual'
import { CHECK_HABIT } from '../models/habit'
import { currentLocalTime, getCurrentLocalDate } from './DateFunctions'




interface RitualItem {
	id: string
	title: string
	checked: boolean
}

interface RitualDialogProps {
	onClose: () => void
	ritualId: string
	entryDate?: string
	entryID?: string
	ritualHistory?: RitualHistoryManager
	setRitualHistory?: (ritualHistory: RitualHistoryManager) => void
}


const HabitDialog: React.FC<RitualDialogProps> = ({ onClose, ritualId, entryDate, entryID, ritualHistory, setRitualHistory }) => {
	const { setDebugText } = useGlobalContext()!
	const [ritualTitle, setRitualTitle] = useState('')
	const [ritualItems, setRitualItems] = useState<RitualItem[]>([])
	const [checkedIds, setCheckedIds] = useState<string[]>([])
	const [editRitualDialogOpen, setEditRitualDialogOpen] = useState(false)
	const [entry, setEntry] = useState<RitualEntry | null>(null)
	const [ritualHistoryManager, setRitualHistoryManager] = useState<RitualHistoryManager>(new RitualHistoryManager())


	// Sounds
	const [playConfirm] = useSound(confirmation, { volume: 0.1 });
	const [playComplete] = useSound(complete, { volume: 0.1 });


	// Get ritual data
	const queryToUse = ritualHistory ? GET_RITUAL : GET_RITUAL_AND_RITUAL_HISTORY;
	const { loading, error, data } = useQuery(queryToUse, {
		fetchPolicy: 'network-only',
		variables: { id: ritualId, yearMonth: entryDate ? entryDate.slice(0, 7) : getCurrentLocalDate().slice(0, 7) },
		onCompleted: (data) => {
			// Set title
			setRitualTitle(data.ritual.title)

			// Initialize ritualHistory if not passed as a prop
			if (!ritualHistory) {
				const fetchedRitualHistory = new RitualHistoryManager()
				fetchedRitualHistory.fromJson(data.ritualHistory.data)
				setRitualHistoryManager(fetchedRitualHistory)
			}

			// Set entry
			if (ritualHistory && entryDate && entryID) {
				const entry1 = ritualHistory.getEntryById(entryDate, entryID)
				setEntry(entry1)

				const updatedRitualItems = JSON.parse(data.ritual.ritualItems).map((ritualItem: any) => {
					const isChecked = entry1 ? entry1.completedItems.includes(ritualItem.id) : false;
					return {
						...ritualItem,
						checked: entry1?.status === RitualStatus.Completed ? true : isChecked,
					};
				});
				setRitualItems(updatedRitualItems)

				// Set the checkedIds state based on the checked property of the updated ritual items
				setCheckedIds(updatedRitualItems.filter((item: { checked: any }) => item.checked).map((item: { id: any }) => item.id))
			} else {
				const updatedRitualItems = JSON.parse(data.ritual.ritualItems).map((ritualItem: any) => {
					const isChecked = data.ritual.checkedItems.includes(ritualItem.id);
					return {
						...ritualItem,
						checked: isChecked,
					};
				});
				setRitualItems(updatedRitualItems)

				// Set the checkedIds state based on the checked property of the updated ritual items
				setCheckedIds(updatedRitualItems.filter((item: { checked: any }) => item.checked).map((item: { id: any }) => item.id))
			}

		},
		skip: !ritualId,
	})




	const [updateRitual] = useMutation(UPDATE_RITUAL)


	// Update ritual history
	const [updateRitualHistory] = useMutation(UPDATE_RITUAL_HISTORY)
	const handleUpdateRitualHistory = () => {
		if (entry && entryDate && ritualHistory) {
			updateRitualHistory({
				fetchPolicy: 'no-cache',
				variables: {
					yearMonth: entryDate.slice(0, 7),
					data: ritualHistory.toJson(),
				},
				onError: (error) => {
					console.log(error)
				}
			})
		}
	}
	const handleCompleteRitualHistory = (options: any) => {
		updateRitualHistory({
			...options,
			onCompleted: () => {
				onClose()
			},
			onError: (error) => {
				console.log(error);
			},
		});
	};



	// Complete ritual entry
	const handleCompleteRitual = () => {
		if (entry && entryDate && ritualHistory && setRitualHistory) {
			const updatedRitualHistory = Object.assign(Object.create(Object.getPrototypeOf(ritualHistory)), ritualHistory);
			updatedRitualHistory.updateEntry(entryDate, {
				...entry,
				completedItems: [],
				status: RitualStatus.Completed,
				completedTime: new Date().toISOString(),
			});
			setRitualHistory(updatedRitualHistory);
			setEntry({
				...entry,
				completedItems: [],
				status: RitualStatus.Completed,
				completedTime: new Date(),
			});

			handleCompleteRitualHistory({
				variables: {
					yearMonth: getCurrentLocalDate().slice(0, 7),
					data: ritualHistory.toJson(),
				},
				onCompleted: (data: any) => {
					console.log(data)
				},
				onError: (error: any) => {
					console.log(error)
				}
			})
		} else {

			// Directly update the ritual otherwise
			updateRitual({
				variables: {
					id: ritualId,
					checked_items: [],
					status: RitualStatus.Completed,
				},
			});

			// Add ritual entry
			const updatedRitualHistory = Object.assign(Object.create(Object.getPrototypeOf(ritualHistoryManager)), ritualHistoryManager);
			updatedRitualHistory.addEntry(getCurrentLocalDate(), {
				ritualID: ritualId,
				completedItems: [],
				type: 'I',
				startTime: null,
				completedTime: currentLocalTime(),
				status: RitualStatus.Completed,
			});

			// Add ritual entry
			handleCompleteRitualHistory({
				variables: {
					yearMonth: getCurrentLocalDate().slice(0, 7),
					data: updatedRitualHistory.toJson(),
				},
				onError: (error: any) => {
					console.log(error)
				}
			})
		}
	}


	// Check habit
	const [checkHabit] = useMutation(CHECK_HABIT)
	const handleCheckHabit = (habitId: string, quantity: number) => {
		checkHabit({
			fetchPolicy: 'no-cache',
			variables: {
				habitId: habitId,
				currentDate: entryDate ? entryDate : getCurrentLocalDate(),
				quantity: quantity,
			},
			onError: (error) => {
				console.log(error)
			}
		})
	}



	// Check item
	const handleCheckItem = async (item: RitualItem) => {
		// Play sound
		playConfirm();

		// Update checked items
		let newCheckedIds = [];
		if (checkedIds.includes(item.id)) {
			newCheckedIds = checkedIds.filter((checkedId) => checkedId !== item.id);
		} else {
			newCheckedIds = [...checkedIds, item.id];
		}
		setCheckedIds(newCheckedIds);

		// Update ritual items
		const updatedItems = ritualItems.map((ritualItem) => {
			if (ritualItem.id === item.id) {

				// If habit update it
				if (item.id.startsWith('h')) {
					ritualItem.checked ? handleCheckHabit(item.id.slice(1), -1) : handleCheckHabit(item.id.slice(1), 1)
				}

				return {
					...ritualItem,
					checked: !ritualItem.checked,
				};
			}
			return ritualItem;
		});
		setRitualItems(updatedItems);

		// Update ritual history if entry exists
		if (entry && entryDate && ritualHistory && setRitualHistory) {
			const updatedRitualHistory = Object.assign(Object.create(Object.getPrototypeOf(ritualHistory)), ritualHistory);

			const ritualEntry: RitualEntry = {
				ritualID: ritualId,
				entryID: entry.entryID,
				completedItems: newCheckedIds,
				type: 'R',
				startTime: entry.startTime,
				completedTime: null,
				status: updatedItems.every((ritualItem) => ritualItem.checked)
					? RitualStatus.Completed
					: RitualStatus.InProgress,
			};

			updatedRitualHistory.updateEntry(entryDate, ritualEntry);  // Changed this line to use updateEntry
			setRitualHistory(updatedRitualHistory);
			setEntry(ritualEntry);
		} else {
			// Directly update the ritual otherwise
			await updateRitual({
				variables: {
					id: ritualId,
					checkedItems: JSON.stringify(newCheckedIds),
				},
			});
		}

		// If ritual is completed, play sound and update ritual history
		if (updatedItems.every((ritualItem) => ritualItem.checked)) {
			playComplete();
			handleCompleteRitual();
		}

		// Update ritual history
		if (ritualHistory && setRitualHistory) {
			handleUpdateRitualHistory()
		}
	};



	const handleStop = () => {
		const updatedItems = ritualItems.map((ritualItem: RitualItem) => ({
			...ritualItem,
			completed: false,
		}));

		updateRitual({
			variables: {
				id: ritualId,
				ritualItems: JSON.stringify(updatedItems),
			},
		});
	};

	const [deleteRitual] = useMutation(DELETE_RITUAL);
	const handleDelete = () => {
		deleteRitual({
			variables: {
				ritualId: ritualId,
			},
			onCompleted: () => {
				onClose();
			},
		});
	};


	// Submenu
	const [submenu, setSubmenu] = useState<null | HTMLElement>(null);
	const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
		setSubmenu(event.currentTarget);
	};
	const handleMenuClose = () => {
		setSubmenu(null);
	};


	// Debug
	useEffect(() => {
		setDebugText([
			{ title: 'Ritual Title', content: ritualTitle },
			{ title: 'Ritual Items', content: JSON.stringify(ritualItems, null, 2) },
			{ title: 'Data', content: JSON.stringify(data, null, 2) },
			{ title: 'Entry Date', content: entryDate },
			{ title: 'Entry ID', content: entryID },
			{ title: 'Entry', content: JSON.stringify(entry, null, 2) },
			{ title: 'Ritual History', content: JSON.stringify(ritualHistory, null, 2) },
		])
	}, [data, ritualId, setDebugText, ritualTitle, ritualItems, entryDate, entryID, entry, ritualHistory])



	// loading and error
	if (loading) return <p>Loading...</p>
	if (error) return <p>Error :(</p>


	return (
		<Dialog open={true} onClose={onClose}>

			{/* Ritual Title */}
			<DialogTitle>
				{ritualTitle}
				<IconButton
					aria-label="menu"
					aria-controls="menu"
					aria-haspopup="true"
					onClick={handleMenuOpen}
					edge="end"
				>
					<MoreVertIcon />
				</IconButton>
				<Menu
					id="menu"
					anchorEl={submenu}
					keepMounted
					open={Boolean(submenu)}
					onClose={handleMenuClose}
				>
					<MenuItem
						onClick={() => {
							handleMenuClose();
							setEditRitualDialogOpen(true);
						}}
					>Edit</MenuItem>
					<MenuItem
						onClick={() => {
							handleMenuClose();
							handleDelete();
						}}
					>
						Delete
					</MenuItem>
				</Menu>
			</DialogTitle>



			{/*  Ritual List */}
			<DialogContent>
				{loading ? <p>Loading...</p> :
					<CustomList
						list={ritualItems}
						handleCheckItem={handleCheckItem}
						checklistType="strikeout"
					/>
				}
			</DialogContent>


			{/* Stop and Save Buttons */}
			<DialogActions>
				<Button onClick={handleStop} color="primary">
					Stop
				</Button>
				<Button onClick={handleCompleteRitual} color="primary" variant="contained">
					Complete
				</Button>
			</DialogActions>

			{editRitualDialogOpen && (
				<EditRitualDialog
					id={ritualId}
					title={ritualTitle}
					handleClose={() => setEditRitualDialogOpen(false)}
				/>
			)}


		</Dialog>
	)
}

export default HabitDialog

