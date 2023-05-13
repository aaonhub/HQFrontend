import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useQuery, useMutation } from '@apollo/client';
import { CREATE_RITUAL, HabitItem } from '../../models/ritual';
import SearchBar from './SearchBar';

import { GET_RITUALS } from '../../models/ritual';
import { Box, Typography } from '@mui/material';

interface RitualDialogProps {
	open: boolean;
	onClose: () => void;
}

const NewRitualDialog: React.FC<RitualDialogProps> = ({ open, onClose }) => {
	const [title, setTitle] = useState<string>('')
	const [habits, setHabits] = useState<{ id: string; title: string }[]>([])
	const [habitToAdd, setHabitToAdd] = useState<HabitItem | undefined>()
	const [order, setOrder] = useState<{ id: string, title: string }[]>([])


	const [ritualItems, setRitualItems] = useState<{ id: string; title: string }[]>([])
	const [newRitualItemTitle, setNewRitualItemTitle] = useState<string>()


	const { loading, error, data } = useQuery(GET_RITUALS);
	const [createRitual] = useMutation(CREATE_RITUAL, {
		refetchQueries: [{ query: GET_RITUALS }],
		onCompleted: () => onClose(),
	});

	const handleSubmit = async () => {
		console.log(title)
		console.log(JSON.stringify(ritualItems))
		console.log(habits.map((habit) => habit.id.slice(1)))
		console.log(JSON.stringify(order))
		await createRitual({
			variables: {
				title: title,
				ritualItems: JSON.stringify(ritualItems),
				habits: habits.map((habit) => habit.id.slice(1)),
				ritualOrder: JSON.stringify(order),
			},
		});
		// console log all the variables
	};




	useEffect(() => {
		if (habitToAdd) {
			setHabits(() => [...habits, { id: 'h' + habitToAdd.id, title: habitToAdd.title, },]);
			setOrder(() => [...order, { id: 'h' + habitToAdd.id, title: habitToAdd.title, },])
			setHabitToAdd(undefined);
		}
	}, [habitToAdd, habits, order]);

	useEffect(() => {
		if (ritualItems) {
			setOrder(() => [...habits, ...ritualItems])
		}
	}, [ritualItems, order, setOrder, habits])




	const findLowestAvailableNumber = () => {
		let availableNumber = 1;
		const existingIds = ritualItems.map((ritualItem) => parseInt(ritualItem.id));

		while (existingIds.includes(availableNumber)) {
			availableNumber++;
		}

		return availableNumber.toString();
	};





	return (
		<Dialog open={open} onClose={onClose}>




			{/* Title */}
			<DialogTitle>
				<TextField
					autoFocus
					margin="dense"
					label="Ritual Title"
					type="text"
					fullWidth
					value={title}
					onChange={(e) => setTitle(e.target.value)}
				/>
			</DialogTitle>


			<DialogContent sx={{ display: 'flex' }}>
				<Box sx={{ flex: 1 }}>
					<DialogContentText>Ritual Items:</DialogContentText>


					{/* List */}
					{order.map((ritualItem) => (
						<Box
							key={ritualItem.id}
							component="div"
							className="habit-item"
							sx={{
								padding: 1,
								marginBottom: 1,
								border: '1px solid lightgray',
								borderRadius: '4px',
							}}
						>
							<Typography>{ritualItem.title}</Typography>
						</Box>
					))}




					{/* Ritual Item input */}
					<TextField
						margin="dense"
						label="New Ritual Item"
						type="text"
						fullWidth
						value={newRitualItemTitle || ''}
						onChange={(e) => setNewRitualItemTitle(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === 'Enter') {
								if (!newRitualItemTitle) return;
								const newId = findLowestAvailableNumber();
								const newRitualItem = { id: newId, title: newRitualItemTitle };

								setRitualItems((prevItems) => {
									const updatedItems = [...prevItems, newRitualItem];
									return updatedItems.sort((a, b) => parseInt(a.id) - parseInt(b.id));
								});

								setNewRitualItemTitle('');
							}
						}}
					/>

				</Box>

				{/* Search */}
				<Box sx={{ marginLeft: 2, width: 300 }}>
					{!loading && !error && data && <SearchBar habits={habits} setHabitToAdd={setHabitToAdd} />}
				</Box>



			</DialogContent>


			{/* Buttons */}
			<DialogActions>
				<Button onClick={onClose}>Cancel</Button>
				<Button onClick={handleSubmit}>Submit</Button>
			</DialogActions>


		</Dialog>
	);

};

export default NewRitualDialog;