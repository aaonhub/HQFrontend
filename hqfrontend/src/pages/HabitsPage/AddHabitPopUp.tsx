import React, { ChangeEvent } from 'react';
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import {
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	MenuItem,
	Select,
	FormControl,
	InputLabel,
	Snackbar,
	Fab,
	Box,
} from '@mui/material';
import { Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

// Queries and Mutations
import { ADD_HABIT } from '../../models/habit';


interface AddHabitPopupProps {
	open: any
	onClose: any
}


const AddHabitPopup: React.FC<AddHabitPopupProps> = ({ open, onClose }) => {
	const [title, setTitle] = useState('');
	const [frequency, setFrequency] = useState('Daily');
	const [addHabit, { error }] = useMutation(ADD_HABIT);

	const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
		setTitle(event.target.value);
	};

	const handleFrequencyChange = (event: any) => {
		setFrequency(event.target.value);
	};

	const handleSubmit = async () => {
		await addHabit({
			variables: {
				Title: title,
				Active: true,
				Frequency: frequency,
			},
		});
		onClose();
	};

	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>Add Habit</DialogTitle>
			<DialogContent>
				<Box mb={2}>
					<TextField
						autoFocus
						margin="dense"
						label="Title"
						fullWidth
						onChange={handleTitleChange}
						variant="outlined"
					/>
				</Box>
				<Box mb={2}>
					<FormControl fullWidth margin="dense" variant="outlined">
						<InputLabel id="frequency-select-label">Frequency</InputLabel>
						<Select
							labelId="frequency-select-label"
							id="frequency-select"
							value={frequency}
							label="Frequency"
							onChange={handleFrequencyChange}
						>
							<MenuItem value="Daily">Daily</MenuItem>
							<MenuItem value="Weekly">Weekly</MenuItem>
							<MenuItem value="Monthly">Monthly</MenuItem>
							<MenuItem value="Yearly">Yearly</MenuItem>
						</Select>
					</FormControl>
				</Box>

				{error && (
					<Snackbar open={!!error}>
						<Alert severity="error">{error.message}</Alert>
					</Snackbar>
				)}

			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Cancel</Button>
				<Fab onClick={handleSubmit} disabled={!!error} color="primary">
					<AddIcon />
				</Fab>
			</DialogActions>
		</Dialog>
	)
}

export default AddHabitPopup