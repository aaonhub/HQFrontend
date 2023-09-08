import React, { ChangeEvent } from 'react';
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Select, FormControl, InputLabel, Snackbar, Fab, Box } from '@mui/material';
import { Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { getCurrentLocalDate } from '../../components/DateFunctions';

// Queries and Mutations
import { ADD_HABIT } from '../../models/habit';


interface AddHabitPopupProps {
	open: boolean
	onClose: () => void
}


const AddHabitPopup: React.FC<AddHabitPopupProps> = ({ open, onClose }) => {
	const [title, setTitle] = useState('');
	const [frequency, setFrequency] = useState('DAILY');
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
				StartDate: getCurrentLocalDate(),
			},
			onCompleted: () => {
				onClose();
			}
		});
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
							<MenuItem value="DAILY">Daily</MenuItem>
							{/* <MenuItem value="WEEKLY">Weekly</MenuItem>
							<MenuItem value="MONTHLY">Monthly</MenuItem>
							<MenuItem value="YEARLY">Yearly</MenuItem> */}
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