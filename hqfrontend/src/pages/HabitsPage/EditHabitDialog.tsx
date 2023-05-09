import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Checkbox, FormGroup, FormControlLabel } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import { useMutation } from '@apollo/client';

// Queries and Mutations
import { UPDATE_HABIT } from '../../models/habit';
import { DELETE_HABIT } from '../../models/habit';

// Models
import Habit, { Frequency } from '../../models/habit';
import { getCurrentLocalDate } from '../../components/DateFunctions';


interface EditHabitDialogProps {
	onClose: () => void
	habit: Habit
	refetch: () => void
}

const EditHabitDialog: React.FC<EditHabitDialogProps> = ({ onClose, habit }) => {
	const [newHabit, setNewHabit] = useState<Habit>(habit);

	const [deleteHabit] = useMutation(DELETE_HABIT);

	const handleDelete = (id: string) => {
		deleteHabit({
			variables: {
				id: id,
			},
		})
		onClose()
	}

	// Required to update the state when the habit prop changes
	useEffect(() => {
		setNewHabit(habit);
	}, [habit])

	const [updateHabit] = useMutation(UPDATE_HABIT, {
		onError: (error) => console.log(error.networkError),
	});

	const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setNewHabit({ ...newHabit, title: e.target.value });
	};

	const handleActiveChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setNewHabit({ ...newHabit, active: e.target.checked });
	};

	const handleFrequencyChange = (e: SelectChangeEvent) => {
		setNewHabit({ ...newHabit, frequency: e.target.value as Frequency });
	};

	const handleSaveClick = () => {
		updateHabit({
			variables: {
				id: habit.id,
				Active: newHabit.active,
				Frequency: newHabit.frequency,
				Title: newHabit.title,
				LastCompleted: getCurrentLocalDate(),
			},
		});
		onClose();
	};

	const handleDeleteClick = () => {
		handleDelete(habit.id);
		onClose();
	}

	return (
		<Dialog open={true} onClose={onClose}>
			<DialogTitle>Edit Habit</DialogTitle>
			<DialogContent>
				<FormGroup>
					<TextField
						autoFocus
						margin="dense"
						label="New Title"
						value={newHabit.title}
						onChange={handleTitleChange}
						autoComplete="off"
					/>

					{/* a checkbox for active */}
					<FormControlLabel control={
						<Checkbox
							checked={newHabit.active}
							onChange={handleActiveChange}
							inputProps={{ 'aria-label': 'controlled' }}
						/>
					} label="Active" />

					<FormControl fullWidth>
						<InputLabel>New Frequency</InputLabel>
						<Select
							labelId="demo-simple-select-label"
							id="demo-simple-select"
							value={newHabit.frequency ? newHabit.frequency : "Daily"}
							label="Age"
							onChange={handleFrequencyChange}
						>
							<MenuItem value={"DAILY"}>Daily</MenuItem>
							<MenuItem value={"WEEKLY"}>Weekly</MenuItem>
							<MenuItem value={"MONTHLY"}>Monthly</MenuItem>
						</Select>
					</FormControl>

				</FormGroup>
			</DialogContent>

			<DialogActions>
				<Button onClick={onClose}>Cancel</Button>
				<Button onClick={handleSaveClick}>Save</Button>
				<Button onClick={handleDeleteClick} color="error">Delete</Button>
			</DialogActions>
		</Dialog>
	);
};

export default EditHabitDialog;
