import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Checkbox, FormGroup, FormControlLabel } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import { useMutation, useQuery } from '@apollo/client';

// Queries and Mutations
import { GET_HABIT } from '../models/habit';
import { UPDATE_HABIT } from '../models/habit';
import { DELETE_HABIT } from '../models/habit';

// Models
import Habit, { Frequency } from '../models/habit';
import { useGlobalContext } from '../pages/App/GlobalContextProvider';


interface EditHabitDialogProps {
	onClose: () => void
	habitId: string
}

const EditHabitDialog: React.FC<EditHabitDialogProps> = ({ onClose, habitId }) => {
	const { setSnackbar } = useGlobalContext();

	const [newHabit, setNewHabit] = useState<Habit>(new Habit(
		"",
		"",
		true,
		"DAILY",
		new Date(),
		0,
		[],
		[],
		0,
		new Date(),
		new Date(),
		"",
		false
	));
	const [openConfirmDelete, setOpenConfirmDelete] = useState(false);

	const { loading, error } = useQuery(GET_HABIT, {
		variables: { habitId: habitId },
		fetchPolicy: "network-only",
		onCompleted: (data) => {
			setNewHabit(
				new Habit(
					data.getHabit.id,
					data.getHabit.title,
					data.getHabit.active,
					data.getHabit.schedule.frequency,
					data.getHabit.streak,
					data.getHabit.history,
					data.getHabit.reminders,
					data.getHabit.reminderTime,
					data.getHabit.createdAt,
					data.getHabit.updatedAt,
					data.getHabit.userId,
					data.getHabit.schedule.timeOfDay,
					data.getHabit.completedToday
				)
			)
			console.log(data.getHabit)
		}
	});

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

	const handleDeleteClick = () => {
		setOpenConfirmDelete(true);
	}

	const handleConfirmDelete = () => {
		setOpenConfirmDelete(false);
		handleDelete(habitId);
	}


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
				id: habitId,
				Title: newHabit.title,
				Active: newHabit.active,
				Frequency: newHabit.frequency,
				TimeOfDay: newHabit.timeOfDay,
			}
		});
	};


	return (
		<Dialog open={true} onClose={onClose}>
			<DialogTitle>Edit Habit</DialogTitle>
			<DialogContent>
				<FormGroup>

					{/* Title */}
					<TextField
						autoFocus
						margin="dense"
						label="New Title"
						value={newHabit.title}
						onChange={handleTitleChange}
						autoComplete="off"
					/>

					{/* Active */}
					<FormControlLabel control={
						<Checkbox
							checked={newHabit.active}
							onChange={handleActiveChange}
							inputProps={{ 'aria-label': 'controlled' }}
						/>
					} label="Active" sx={{ paddingBottom: 2 }} />

					{/* Frequency */}
					<FormControl fullWidth sx={{ paddingBottom: 2 }}>
						<InputLabel>New Frequency</InputLabel>
						<Select
							labelId="demo-simple-select-label"
							id="demo-simple-select"
							value={newHabit.frequency ? newHabit.frequency : "DAILY"}
							label="Age"
							onChange={handleFrequencyChange}
						>
							<MenuItem value={"DAILY"}>Daily</MenuItem>
							{/* <MenuItem value={"WEEKLY"}>Weekly</MenuItem>
							<MenuItem value={"MONTHLY"}>Monthly</MenuItem> */}
						</Select>
					</FormControl>

					{/* Start Time */}
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

			{/* Confirm deletion dialog */}
			<Dialog open={openConfirmDelete} onClose={() => setOpenConfirmDelete(false)}>
				<DialogTitle>Confirm Deletion</DialogTitle>
				<DialogContent>Are you sure you want to delete this habit?</DialogContent>
				<DialogActions>
					<Button onClick={() => setOpenConfirmDelete(false)}>No</Button>
					<Button onClick={handleConfirmDelete} color="error">Yes</Button>
				</DialogActions>
			</Dialog>


		</Dialog>
	);
};

export default EditHabitDialog;
