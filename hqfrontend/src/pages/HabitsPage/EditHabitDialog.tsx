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
import { useGlobalContext } from '../App/GlobalContextProvider';


interface EditHabitDialogProps {
	onClose: () => void
	habit: Habit
}

const EditHabitDialog: React.FC<EditHabitDialogProps> = ({ onClose, habit }) => {
	const { setSnackbar } = useGlobalContext();
	const [newHabit, setNewHabit] = useState<Habit>(habit);

	// Delete Habit
	const [deleteHabit] = useMutation(DELETE_HABIT);
	const handleDelete = (id: string) => {
		deleteHabit({
			variables: {
				id: id,
			},
			onCompleted: () => {
				onClose();
			}
		})
	}

	// Required to update the state when the habit prop changes
	useEffect(() => {
		setNewHabit(habit);
	}, [habit])


	const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setNewHabit({ ...newHabit, title: e.target.value });
	};

	const handleActiveChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setNewHabit({ ...newHabit, active: e.target.checked });
	};

	const handleFrequencyChange = (e: SelectChangeEvent) => {
		setNewHabit({ ...newHabit, frequency: e.target.value as Frequency });
	};

	const handleTimeOfDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setNewHabit({ ...newHabit, timeOfDay: e.target.value });
	};

	const [updateHabit] = useMutation(UPDATE_HABIT, {
		onCompleted: () => {
			setSnackbar({ open: true, message: "Habit Updated", severity: "success" });
			onClose();
		},
		onError: (error) => console.log(error.networkError),
	});
	const handleSaveClick = () => {
		updateHabit({
			variables: {
				id: habit.id,
				Title: newHabit.title,
				Active: newHabit.active,
				Frequency: newHabit.frequency,
				TimeOfDay: newHabit.timeOfDay,
			}
		});
	};

	const handleDeleteClick = () => {
		handleDelete(habit.id)
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
					} label="Active" sx={{ paddingBottom: 2 }} />

					<FormControl fullWidth sx={{ paddingBottom: 2 }}>
						<InputLabel>New Frequency</InputLabel>
						<Select
							labelId="demo-simple-select-label"
							id="demo-simple-select"
							value={newHabit.frequency ? newHabit.frequency : "Daily"}
							label="Age"
							onChange={handleFrequencyChange}
						>
							<MenuItem value={"DAILY"}>Daily</MenuItem>
							{/* <MenuItem value={"WEEKLY"}>Weekly</MenuItem>
							<MenuItem value={"MONTHLY"}>Monthly</MenuItem> */}
						</Select>
					</FormControl>

					{/* Start Time Selector */}
					<TextField
						id="time"
						label="Time of Day"
						type="time"
						value={newHabit.timeOfDay}
						onChange={handleTimeOfDayChange}
						InputLabelProps={{
							shrink: true,
						}}
					/>

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
