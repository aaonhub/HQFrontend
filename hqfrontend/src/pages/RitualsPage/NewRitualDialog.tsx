import React, { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Ritual, { HabitItem, RitualItem } from '../../models/ritual'

interface RitualDialogProps {
	open: boolean;
	onClose: () => void;
}

const NewRitualDialog: React.FC<RitualDialogProps> = ({ open, onClose }) => {
	const [title, setTitle] = useState('');
	const [habits, setHabits] = useState<HabitItem[]>([]);
	const [ritualItems, setRitualItems] = useState<RitualItem[]>([]);

	const handleAddHabit = (habit: HabitItem) => {
		setHabits([...habits, habit]);
	};

	const handleAddRitualItem = (ritualItem: RitualItem) => {
		setRitualItems([...ritualItems, ritualItem]);
	};

	const handleSubmit = () => {
		// TODO: Generate a unique id and handle the order appropriately
		const ritual = new Ritual('id', title, habits, ritualItems, []);
	};

	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>New Ritual</DialogTitle>
			<DialogContent>
				<DialogContentText>
					Please fill out the ritual details below.
				</DialogContentText>
				<TextField
					autoFocus
					margin="dense"
					label="Ritual Title"
					type="text"
					fullWidth
					value={title}
					onChange={(e) => setTitle(e.target.value)}
				/>
				{/* Add habit selection and ritual item input fields here */}
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Cancel</Button>
				<Button onClick={handleSubmit}>Submit</Button>
			</DialogActions>
		</Dialog>
	);
};

export default NewRitualDialog;
