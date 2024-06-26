import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Checkbox, FormGroup, FormControlLabel, Menu, MenuItem, IconButton } from '@mui/material';
import { useGlobalContext } from '../pages/App/GlobalContextProvider';
import { useMutation, useQuery } from '@apollo/client';
import MoreVertIcon from '@mui/icons-material/MoreVert';

// Components
import { createEmptyHabit } from '../models/habit';

// Queries
import { GET_HABIT } from '../models/habit';

// Mutations
import { UPDATE_HABIT, DELETE_HABIT } from '../models/habit';

// Models
import Habit from '../models/habit';
import Schedule from '../models/schedule';
import EditScheduleDialog from './EditScheduleDialog';


interface EditHabitDialogProps {
	onClose: () => void
	habitId: string
}

const EditHabitDialog: React.FC<EditHabitDialogProps> = ({ onClose, habitId }) => {
	const { setSnackbar } = useGlobalContext();

	const [newHabit, setNewHabit] = useState<Habit>(createEmptyHabit());
	const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
	const [openEditSchedule, setOpenEditSchedule] = useState(false);
	const [submenu, setSubmenu] = useState<null | HTMLElement>(null);


	const { loading, error, data } = useQuery(GET_HABIT, {
		variables: { habitId: habitId },
		fetchPolicy: "network-only",
		onCompleted: (data) => {

			const habit = data.getHabit;

			// Create Schedule
			const schedule = new Schedule({
				id: habit.schedules[0].id,
				status: habit.schedules[0].status,
				visibility: habit.schedules[0].visibility,
				timeOfDay: habit.schedules[0].timeOfDay,
				startDate: habit.schedules[0].startDate,
				endDate: habit.schedules[0].endDate,
				timezone: habit.schedules[0].timezone,
				recurrenceRule: habit.schedules[0].recurrenceRule,
				exclusionDates: habit.schedules[0].exclusionDates,
				reminderBeforeEvent: habit.schedules[0].reminderBeforeEvent,
				description: habit.schedules[0].description,
				contentId: habit.schedules[0].contentId,
				priority: habit.schedules[0].priority,
			})

			// Create Habit
			const newHabit = new Habit({
				id: data.getHabit.id,
				title: data.getHabit.title,
				active: data.getHabit.active,
				length: data.getHabit.length,
				schedule: schedule,
				countToday: data.getHabit.countOnDate,
			})

			setNewHabit(newHabit)
		},
		onError: (error) => console.log(error.networkError),
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

	// Submenu
	const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
		setSubmenu(event.currentTarget);
	};
	const handleMenuClose = () => {
		setSubmenu(null);
	};


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
	const handleSaveClick = () => {
		updateHabit({
			variables: {
				id: habitId,
				Title: newHabit.title,
				Active: newHabit.active,
				TimeOfDay: newHabit.schedule.timeOfDay,
			}
		});
	};


	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error</p>;


	return (
		<Dialog open={true} onClose={onClose}>
			<DialogTitle>
				Edit Habit

				{/* Open Menu Icon */}
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
							setOpenEditSchedule(true)
						}}
					>Edit</MenuItem>
					<MenuItem
						onClick={() => {
							handleMenuClose();
							handleDeleteClick();
						}}
					>
						Delete
					</MenuItem>
				</Menu>
			</DialogTitle>

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
				<Button onClick={handleSaveClick}>Save</Button>
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


			{/* Edit Schedule Dialog */}
			{openEditSchedule &&
				<EditScheduleDialog id={data.getHabit.schedules[0].id} handleClose={() => setOpenEditSchedule(false)} />
			}


		</Dialog>
	);
};

export default EditHabitDialog;
