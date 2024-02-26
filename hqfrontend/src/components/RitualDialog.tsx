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
import { getCurrentLocalDate } from './DateFunctions'

// Sounds
import complete from '../sounds/complete.wav'
import confirmation from '../sounds/confirmation.mp3'

// Queries and mutations
import {
	UPDATE_RITUAL,
	GET_RITUAL,
	RitualStatus
} from '../models/ritual'
import { CHECK_HABIT } from '../models/habit'


interface RitualItem {
	id: string
	title: string
	checked: boolean
}

interface RitualDialogProps {
	onClose: () => void
	ritualId: string
}


const RitualDialog: React.FC<RitualDialogProps> = (props: RitualDialogProps) => {
	const { setDebugText } = useGlobalContext()!

	const [ritualTitle, setRitualTitle] = useState('')
	const [ritualItems, setRitualItems] = useState<RitualItem[]>([])
	const [checkedIds, setCheckedIds] = useState<string[]>([])
	const [editRitualDialogMenuOpen, setEditRitualDialogMenuOpen] = useState(false)


	// Sounds
	const [playConfirm] = useSound(confirmation, { volume: 0.1 });
	const [playComplete] = useSound(complete, { volume: 0.1 });


	// Get ritual data
	const { loading, error, data } = useQuery(GET_RITUAL, {
		variables: { id: props.ritualId },
		onCompleted: (data) => {
			// Set title
			setRitualTitle(data.ritual.title)

			// Set ritual items
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
		},
		onError: (error) => {
			console.log(error)
		}
	})


	const [updateRitual] = useMutation(UPDATE_RITUAL)

	// Reset ritual entry
	const handleResetRitual = () => {
		updateRitual({
			variables: {
				id: props.ritualId,
				checkedItems: "[]",
				status: RitualStatus.Unstarted,
			}
		});
	}


	// Check habit
	const [checkHabit] = useMutation(CHECK_HABIT)
	const handleCheckHabit = (habitId: string, quantity: number) => {
		checkHabit({
			fetchPolicy: 'no-cache',
			variables: {
				habitId: habitId,
				currentDate: getCurrentLocalDate(),
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

		// Update database
		await updateRitual({
			variables: {
				id: props.ritualId,
				checkedItems: JSON.stringify(newCheckedIds),
				status: RitualStatus.InProgress,
			}
		});


		// If ritual is completed, play sound and update ritual history
		if (updatedItems.every((ritualItem) => ritualItem.checked)) {
			playComplete();
			handleResetRitual();
		}

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
		])
	}, [data, props.ritualId, setDebugText, ritualTitle, ritualItems])



	// loading and error
	if (loading) return <p>Loading...</p>
	if (error) return <p>Error :(</p>


	return (
		<Dialog open={true} onClose={props.onClose} fullWidth maxWidth="sm">

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
							setEditRitualDialogMenuOpen(true);
						}}
					>Edit</MenuItem>
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
				<Button onClick={handleResetRitual} color="primary" variant="contained">
					Reset
				</Button>
			</DialogActions>

			{editRitualDialogMenuOpen && (
				<EditRitualDialog
					id={props.ritualId}
					title={ritualTitle}
					handleClose={() => setEditRitualDialogMenuOpen(false)}
				/>
			)}


		</Dialog>
	)
}

export default RitualDialog

