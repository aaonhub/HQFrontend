import React, { useEffect, useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { useMutation } from '@apollo/client'
import { CREATE_RITUAL } from '../../models/ritual'
import SearchBar from './SearchBar'

import { Box, Typography } from '@mui/material'

interface RitualDialogProps {
	open: boolean;
	onClose: () => void;
}

export interface RitualItemType {
	id: string;
	title: string;
	completed: boolean;
}

const NewRitualDialog: React.FC<RitualDialogProps> = ({ open, onClose }) => {
	const [title, setTitle] = useState<string>('')
	const [habits, setHabits] = useState<RitualItemType[]>([])
	const [ritualItems, setRitualItems] = useState<RitualItemType[]>([])

	const [habitToAdd, setHabitToAdd] = useState<RitualItemType>()
	const [newRitualItemTitle, setNewRitualItemTitle] = useState<string>()


	// Create Ritual
	const [createRitual] = useMutation(CREATE_RITUAL, {
		onCompleted: () => onClose(),
	});

	const handleSubmit = async () => {
		await createRitual({
			variables: {
				title: title,
				ritualItems: JSON.stringify(ritualItems),
				habits: habits.map((habit) => habit.id),
			},
		});
	};




	useEffect(() => {
		if (habitToAdd) {
			setHabits([...habits, habitToAdd])
			setRitualItems(() => [...ritualItems, { id: 'h' + habitToAdd.id, title: habitToAdd.title, completed: false },])
			setHabitToAdd(undefined)
		}
	}, [habitToAdd, habits, ritualItems])




	const findLowestAvailableNumber = () => {
		let availableNumber = 1;
		const existingIds = ritualItems.map((ritualItem) => parseInt(ritualItem.id));

		while (existingIds.includes(availableNumber)) {
			availableNumber++;
		}

		return availableNumber.toString();
	};





	return (
		<Dialog open={open} onClose={onClose}>




			{/* Title */}
			<DialogTitle sx={{ pb: 0 }}>
				<TextField
					autoFocus
					margin="dense"
					label="Ritual Title"
					type="text"
					fullWidth
					value={title}
					onChange={(e) => setTitle(e.target.value)}
				/>
			</DialogTitle>



			<DialogContent sx={{ display: 'flex' }}>
				<Box sx={{ flex: 1 }}>
					<DialogContentText>Ritual Items:</DialogContentText>
					{ritualItems.map((ritualItem) => (
						<Box
							key={ritualItem.id}
							component="div"
							className="habit-item"
							sx={{
								padding: 1,
								marginBottom: 1,
								border: '1px solid lightgray',
								borderRadius: '4px',
							}}
						>
							<Typography>{ritualItem.title}</Typography>
						</Box>
					))}
					<TextField
						margin="dense"
						label="New Ritual Item"
						type="text"
						fullWidth
						value={newRitualItemTitle || ''}
						onChange={(e) => setNewRitualItemTitle(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === 'Enter') {
								if (!newRitualItemTitle) return;
								const newId = findLowestAvailableNumber();
								const newRitualItem = { id: newId, title: newRitualItemTitle, completed: false };

								setRitualItems((prevItems) => {
									const updatedItems = [...prevItems, newRitualItem];
									return updatedItems.sort((a, b) => parseInt(a.id) - parseInt(b.id));
								});

								setNewRitualItemTitle('');
							}
						}}
					/>
				</Box>
				<Box sx={{ marginLeft: 2, width: 300 }}>
					<SearchBar habits={habits} setHabitToAdd={setHabitToAdd} />
				</Box>
			</DialogContent>



			{/* Buttons */}
			<DialogActions>
				<Button onClick={onClose}>Cancel</Button>
				<Button onClick={handleSubmit}>Submit</Button>
			</DialogActions>


		</Dialog>
	);

};

export default NewRitualDialog;