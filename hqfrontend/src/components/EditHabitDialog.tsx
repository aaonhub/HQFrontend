import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Checkbox, FormGroup, FormControlLabel } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useGlobalContext } from '../pages/App/GlobalContextProvider';
import { useMutation, useQuery } from '@apollo/client';

// Queries and Mutations
import { GET_HABIT, createEmptyHabit } from '../models/habit';
import { UPDATE_HABIT } from '../models/habit';
import { DELETE_HABIT } from '../models/habit';

// Models
import Habit from '../models/habit';
import Schedule from '../models/schedule';


interface EditHabitDialogProps {
	onClose: () => void
	habitId: string
}

const EditHabitDialog: React.FC<EditHabitDialogProps> = ({ onClose, habitId }) => {
	const { setSnackbar } = useGlobalContext();

	const [newHabit, setNewHabit] = useState<Habit>(createEmptyHabit());
	const [openConfirmDelete, setOpenConfirmDelete] = useState(false);

	const { loading, error, data, refetch } = useQuery(GET_HABIT, {
		variables: { habitId: habitId },
		fetchPolicy: "network-only",
		onCompleted: (data) => {

			const habit = data.getHabit;

			// Create Schedule
			const schedule = new Schedule({
				status: habit.schedules.status,
				visibility: habit.schedules.visibility,
				timeOfDay: habit.schedules.timeOfDay,
				startDate: habit.schedules.startDate,
				endDate: habit.schedules.endDate,
				timezone: habit.schedules.timezone,
				recurrenceRule: habit.schedules.recurrenceRule,
				exclusionDates: habit.schedules.exclusionDates,
				reminderBeforeEvent: habit.schedules.reminderBeforeEvent,
				description: habit.schedules.description,
				priority: habit.schedules.priority
			})

			// Create Habit
			const newHabit = new Habit({
				id: data.getHabit.id,
				title: data.getHabit.title,
				active: data.getHabit.active,
				length: data.getHabit.length,
				schedule: schedule,
				countToday: data.getHabit.countToday,
			})

			setNewHabit(newHabit)
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

	const handleTimeOfDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const timeOfDay = e.target.value || '';
		setNewHabit({ ...newHabit, schedule: { ...newHabit.schedule, timeOfDay: timeOfDay } });
	};

	const [updateHabit] = useMutation(UPDATE_HABIT, {
		onCompleted: () => {
			setSnackbar({ open: true, message: "Habit Updated", severity: "success" });
			onClose();
		},
		onError: (error) => console.log(error.networkError),
	});
	// const handleSaveClick = () => {
	// 	updateHabit({
	// 		variables: {
	// 			id: habitId,
	// 			Title: newHabit.title,
	// 			Active: newHabit.active,
	// 			Frequency: newHabit.schedule.frequency,
	// 			TimeOfDay: newHabit.schedule.timeOfDay,
	// 		}
	// 	});
	// };





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


					{/* Start Time */}
					<TextField
						id="time"
						label="Time of Day"
						type="time"
						// Use an empty string if timeOfDay is null
						value={newHabit.schedule.timeOfDay || ''}
						onChange={handleTimeOfDayChange}
						InputLabelProps={{
							shrink: true,
						}}
					/>
					
				</FormGroup>
			</DialogContent>

			<DialogActions>
				<Button onClick={onClose}>Cancel</Button>
				{/* <Button onClick={handleSaveClick}>Save</Button> */}
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
