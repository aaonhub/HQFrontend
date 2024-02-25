import React, { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import useSound from 'use-sound'
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, CheckboxGroup, Checkbox, useDisclosure } from "@nextui-org/react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";



// Components
import { useGlobalContext } from '../pages/App/GlobalContextProvider'
import EditRitualDialog from './EditRitualDialog'
import { currentLocalTime, getCurrentLocalDate } from './DateFunctions'

// Sounds
import complete from '../sounds/complete.wav'
import confirmation from '../sounds/confirmation.mp3'

// Queries and mutations
import {
	UPDATE_RITUAL,
	DELETE_RITUAL,
	GET_RITUAL,
	UPDATE_RITUAL_HISTORY,
	RitualHistoryManager, RitualEntry, RitualStatus
} from '../models/ritual'
import { CHECK_HABIT } from '../models/habit'


interface RitualItem {
	id: string
	title: string
	checked: boolean
}

interface RitualDialogProps {
	onClose?: () => void
	ritualId: string
	entryDate?: string
	scheduleId?: string
	ritualHistory?: RitualHistoryManager
	setRitualHistory?: (ritualHistory: RitualHistoryManager) => void
}


const RitualDialog: React.FC<RitualDialogProps> = (props: RitualDialogProps) => {
	const { setDebugText } = useGlobalContext()!

	const [ritualTitle, setRitualTitle] = useState('')
	const [ritualItems, setRitualItems] = useState<RitualItem[]>([])
	const [checkedIds, setCheckedIds] = useState<string[]>([])
	const [editRitualDialogMenuOpen, setEditRitualDialogMenuOpen] = useState(false)
	const [entry, setEntry] = useState<RitualEntry>({
		ritualID: '',
		scheduleID: '',
		completedItems: [],
		startTime: null,
		completedTime: null,
		status: RitualStatus.Unstarted
	})
	const [ritualHistoryManager, setRitualHistoryManager] = useState<RitualHistoryManager>(new RitualHistoryManager())



	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	// Sounds
	const [playConfirm] = useSound(confirmation, { volume: 0.1 });
	const [playComplete] = useSound(complete, { volume: 0.1 });


	// Get ritual data
	const { loading, error, data } = useQuery(GET_RITUAL, {
		variables: { id: props.ritualId },
		onCompleted: (data) => {
			// Set title
			setRitualTitle(data.ritual.title)

			let entry1: RitualEntry | null = null

			// If entry exists, set it
			if (props.entryDate && props.ritualHistory && props.scheduleId) {
				entry1 = props.ritualHistory.getEntryById(props.entryDate, props.scheduleId)
				if (entry1) {
					setEntry(entry1)
					setCheckedIds(entry1.completedItems)
				}
			}
			// Otherwise create it
			else {
				const ritualEntry: RitualEntry = {
					ritualID: props.ritualId,
					scheduleID: "1",
					completedItems: [],
					startTime: null,
					completedTime: null,
					status: RitualStatus.Unstarted
				};

				entry1 = ritualEntry

				ritualHistoryManager.addOrUpdateEntry("1", ritualEntry);  // Changed this line to use updateEntry
			}

			// Set ritual items and checked state
			const updatedRitualItems = JSON.parse(data.ritual.ritualItems).map((ritualItem: any) => {
				const isChecked = entry1 ? entry1.completedItems.includes(ritualItem.id) : false;
				return {
					...ritualItem,
					checked: entry1?.status === RitualStatus.Completed ? true : isChecked,
				};
			});

			if (entry1) {
				setEntry(entry1)
			}
			setRitualHistoryManager(ritualHistoryManager)
			setRitualItems(updatedRitualItems)

			// Set the checkedIds state based on the checked property of the updated ritual items
			setCheckedIds(updatedRitualItems.filter((item: { checked: any }) => item.checked).map((item: { id: any }) => item.id))
		},
	})


	const [updateRitual] = useMutation(UPDATE_RITUAL)


	// Update ritual history
	const [updateRitualHistory] = useMutation(UPDATE_RITUAL_HISTORY)
	const handleUpdateRitualHistory = () => {
		if (props.ritualHistory && props.entryDate) {
			updateRitualHistory({
				variables: {
					yearMonth: props.entryDate.slice(0, 7),
					data: props.ritualHistory.toJson(),
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
				onOpenChange()
			},
			onError: (error) => {
				console.log(error);
			},
		});
	};



	// Complete ritual entry
	const handleCompleteRitual = () => {
		// Update Unscheduled Ritual
		if (props.ritualHistory && props.entryDate && props.scheduleId) {
			props.ritualHistory.addOrUpdateEntry(props.entryDate, {
				ritualID: props.ritualId,
				scheduleID: props.scheduleId,
				startTime: entry.startTime,
				completedItems: [],
				completedTime: new Date(),
				status: RitualStatus.Completed,
			});


			handleCompleteRitualHistory({
				variables: {
					yearMonth: getCurrentLocalDate().slice(0, 7),
					data: props.ritualHistory.toJson(),
				},
			})
		}
		// Update Scheduled Ritual
		else {
			// Update ritual
			updateRitual({
				variables: {
					id: props.ritualId,
					checked_items: [],
					status: RitualStatus.Unstarted,
				},
			});
		}
	}


	// Check habit
	const [checkHabit] = useMutation(CHECK_HABIT)
	const handleCheckHabit = (habitId: string, quantity: number) => {
		checkHabit({
			fetchPolicy: 'no-cache',
			variables: {
				habitId: habitId,
				currentDate: props.entryDate ? props.entryDate : getCurrentLocalDate(),
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


		// Unscheduled Ritual
		if (props.ritualHistory && props.entryDate && props.scheduleId) {
			const ritualEntry: RitualEntry = {
				ritualID: props.ritualId,
				scheduleID: entry.scheduleID,
				completedItems: newCheckedIds,
				startTime: entry.startTime ? entry.startTime : currentLocalTime(),
				completedTime: null,
				status: RitualStatus.InProgress,
			};

			props.ritualHistory.addOrUpdateEntry(props.entryDate, ritualEntry);
			setEntry(ritualEntry);
		}
		// Scheduled Ritual
		else {
			await updateRitual({
				variables: {
					id: props.ritualId,
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
		if (props.scheduleId) {
			handleUpdateRitualHistory()
		}
	};



	const [deleteRitual] = useMutation(DELETE_RITUAL);
	const handleDelete = () => {
		deleteRitual({
			variables: {
				ritualId: props.ritualId,
			},
			onCompleted: () => {
				onOpenChange();
			},
		});
	};


	// Submenu
	const [submenu, setSubmenu] = useState<null | HTMLElement>(null);

	const handleMenuClose = () => {
		setSubmenu(null);
	};


	// Debug
	useEffect(() => {
		setDebugText([
			{ title: 'Ritual Title', content: ritualTitle },
			{ title: 'Ritual Items', content: JSON.stringify(ritualItems, null, 2) },
			{ title: 'Data', content: JSON.stringify(data, null, 2) },
			{ title: 'Entry Date', content: props.entryDate },
			{ title: 'Schedule ID', content: props.scheduleId },
			{ title: 'Entry', content: JSON.stringify(entry, null, 2) },
			{ title: 'Ritual History', content: JSON.stringify(props.ritualHistory, null, 2) },
		])
	}, [data, props.ritualId, setDebugText, ritualTitle, ritualItems, props.entryDate, props.scheduleId, entry, props.ritualHistory])



	// loading and error
	if (loading) return <p>Loading...</p>
	if (error) return <p>Error :(</p>


	return (
		<>
			<Button onPress={onOpen}>Open Modal</Button>
			<Modal isOpen={isOpen} onClose={onOpenChange}>
				<ModalContent>
					{(onClose) => (
						<>
							{/* Ritual Title */}
							<ModalHeader className="flex flex-col gap-1">
								{ritualTitle}
							</ModalHeader>


							{/*  Ritual List */}
							<ModalBody>


								<Dropdown>
									<DropdownTrigger>
										<Button variant="bordered"
										>Open Menu</Button>
									</DropdownTrigger>

									<DropdownMenu aria-label="Static Actions">

										{/* Edit */}
										<DropdownItem
											key="edit"
											onClick={() => {
												handleMenuClose();
												setEditRitualDialogMenuOpen(true);
											}}
										>Edit</DropdownItem>

										{/* Delete */}
										<DropdownItem
											key="delete"
											className="text-danger"
											color="danger"
											onClick={() => {
												handleMenuClose();
												handleDelete();
											}}
										>Delete</DropdownItem>

									</DropdownMenu>
								</Dropdown>


								{loading ? <p>Loading...</p> :
									<CheckboxGroup
										defaultValue={["buenos-aires", "london"]}
									>
										{
											ritualItems.map((ritualItem) => {
												return (
													<Checkbox
														key={ritualItem.id}
														value={ritualItem.id}
														checked={ritualItem.checked}
														onChange={() => handleCheckItem(ritualItem)}
													>
														{ritualItem.title}
													</Checkbox>
												)
											})
										}
									</CheckboxGroup>
								}
							</ModalBody>


							{/* Stop and Save Buttons */}
							<ModalFooter>
								<Button color="primary" onPress={handleCompleteRitual}>
									Complete
								</Button>
							</ModalFooter>

							{editRitualDialogMenuOpen && (
								<EditRitualDialog
									id={props.ritualId}
									title={ritualTitle}
									handleClose={() => setEditRitualDialogMenuOpen(false)}
								/>
							)}

						</>
					)}
				</ModalContent>
			</Modal>
		</>
	)
}

export default RitualDialog

