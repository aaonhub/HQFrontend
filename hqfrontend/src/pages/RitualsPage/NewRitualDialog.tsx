import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useQuery, gql } from '@apollo/client';
import Ritual, { HabitItem, RitualItem } from '../../models/ritual';
import SearchBar from '../../components/SearchBar';

import { GET_RITUALS } from '../../models/ritual';

interface RitualDialogProps {
	open: boolean;
	onClose: () => void;
}

const NewRitualDialog: React.FC<RitualDialogProps> = ({ open, onClose }) => {
	const [title, setTitle] = useState<string>('');
	const [habits, setHabits] = useState<HabitItem[]>([]);
	const [ritualItems, setRitualItems] = useState<RitualItem[]>([]);
	const { loading, error, data } = useQuery(GET_RITUALS);

	const handleAddHabit = (habit: HabitItem) => {
		setHabits([...habits, habit]);
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

				{/* Search bar */}
				{/* {!loading && !error && data && (
					<SearchBar data={data.rituals} onSelect={handleAddHabit} />
				)} */}

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
