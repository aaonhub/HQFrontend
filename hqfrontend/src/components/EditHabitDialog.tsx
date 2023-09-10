import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Checkbox, FormGroup, FormControlLabel } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useGlobalContext } from '../pages/App/GlobalContextProvider';
import { useMutation, useQuery } from '@apollo/client';

// Queries and Mutations
import { GET_HABIT } from '../models/habit';
import { UPDATE_HABIT } from '../models/habit';
import { DELETE_HABIT } from '../models/habit';

// Models
import Habit from '../models/habit';
import Schedule, { Frequency } from '../models/schedule';


interface EditHabitDialogProps {
	onClose: () => void
	habitId: string
}

const EditHabitDialog: React.FC<EditHabitDialogProps> = ({ onClose, habitId }) => {
	const { setSnackbar } = useGlobalContext();

	const emptySchedule = new Schedule({
		frequency: 'DAILY',
		daysOfTheWeek: [],
		daysOfTheMonth: [],
		dayOfTheYear: [],
		startDate: '',
		endDate: null,
		timeOfDay: '',
	});
	const tempHabit = new Habit({
		id: '',
		title: '',
		active: false,
		length: '',
		schedule: emptySchedule,
		countToday: 0,
	});

	const [newHabit, setNewHabit] = useState<Habit>(tempHabit);
	const [openConfirmDelete, setOpenConfirmDelete] = useState(false);

	useQuery(GET_HABIT, {
		variables: { habitId: habitId },
		fetchPolicy: "network-only",
		onCompleted: (data) => {

			// Create Schedule
			const schedule = new Schedule({
				frequency: data.getHabit.schedule.frequency,
				daysOfTheWeek: data.getHabit.schedule.daysOfTheWeek,
				daysOfTheMonth: data.getHabit.schedule.daysOfTheMonth,
				dayOfTheYear: data.getHabit.schedule.daysOfTheYear,
				startDate: data.getHabit.schedule.startDate,
				endDate: data.getHabit.schedule.endDate,
				timeOfDay: data.getHabit.schedule.timeOfDay,
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

	const handleFrequencyChange = (e: SelectChangeEvent) => {
		setNewHabit({ ...newHabit, schedule: { ...newHabit.schedule, frequency: e.target.value as Frequency } });
	};

	const handleTimeOfDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setNewHabit({ ...newHabit, schedule: { ...newHabit.schedule, timeOfDay: e.target.value } });
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
				Frequency: newHabit.schedule.frequency,
				TimeOfDay: newHabit.schedule.timeOfDay,
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
							value={newHabit.schedule.frequency ? newHabit.schedule.frequency : "DAILY"}
							label="Age"
							onChange={handleFrequencyChange}
						>
							<MenuItem value={"NONE"}>None</MenuItem>
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
						value={newHabit.schedule.timeOfDay}
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
