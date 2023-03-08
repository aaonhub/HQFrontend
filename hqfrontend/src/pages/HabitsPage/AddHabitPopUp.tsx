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
	SelectChangeEvent,
	Snackbar,
} from '@mui/material';
import { Alert } from '@mui/material';
import { ADD_HABIT } from './habitsQueries';

interface AddHabitPopupProps {
	open: boolean;
	onClose: () => void;
}

export default function AddHabitPopup({ open, onClose }: AddHabitPopupProps): JSX.Element {
	const [title, setTitle] = useState('');
	const [frequency, setFrequency] = useState<'Daily' | 'Weekly' | 'Monthly' | 'Yearly'>('Daily');
	const [addHabit, { error, data }] = useMutation(ADD_HABIT);

	const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setTitle(event.target.value);
	};

	const handleFrequencyChange = (event: SelectChangeEvent<'Daily' | 'Weekly' | 'Monthly' | 'Yearly'>) => {
		setFrequency(event.target.value as 'Daily' | 'Weekly' | 'Monthly' | 'Yearly');
	};

	const handleSubmit = async () => {
		const result = await addHabit({
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
				<TextField autoFocus margin="dense" label="Title" fullWidth onChange={handleTitleChange} />
				<FormControl fullWidth margin="dense">
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

				{error && (
					<Snackbar open={!!error}>
						<Alert severity="error">{error.message}</Alert>
					</Snackbar>
				)}

			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Cancel</Button>
				<Button onClick={handleSubmit} disabled={!!error}>Add</Button>
			</DialogActions>
		</Dialog>

	);
}
