import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Box, Button, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemSecondaryAction, ListItemText, TextField } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { GET_HABITS, ADD_HABIT, DELETE_HABIT, UPDATE_HABIT } from './habitsQueries';

interface Habit {
	id: string;
	attributes: {
		Title: string;
		Active: boolean;
		Frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Yearly';
		LastCompleted: Date;
	};
}

interface HabitsData {
	habits: {
		data: Habit[];
	};
}

interface AddHabitData {
	createHabit: {
		habit: Habit;
	};
}

interface DeleteHabitData {
	deleteHabit: {
		habit: Habit;
	};
}

interface UpdateHabitData {
	updateHabit: {
		habit: Habit;
	};
}

export default function HabitsPage(): JSX.Element {
	const { loading, error, data, refetch } = useQuery<HabitsData>(GET_HABITS);
	const [newHabit, setNewHabit] = useState<string>('');
	const [addHabit] = useMutation<AddHabitData>(ADD_HABIT, {
		onCompleted: () => refetch(),
		onError: (error) => console.log(error, error.message),
	});
	const [deleteHabit] = useMutation<DeleteHabitData>(DELETE_HABIT, {
		onCompleted: () => refetch(),
		onError: (error) => console.log(error.networkError),
	});
	const [updateHabit] = useMutation<UpdateHabitData>(UPDATE_HABIT, {
		onCompleted: () => refetch(),
		onError: (error) => console.log(error.networkError),
	});

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
		e.preventDefault();
		addHabit({
			variables: { Title: newHabit, Active: true, Frequency: 'Daily', LastCompleted: new Date() },
		});
		setNewHabit('');
	};

	const handleDelete = (id: string): void => {
		deleteHabit({
			variables: { id },
		});
	};

	const handleComplete = (id: string, completed: boolean): void => {
		updateHabit({
			variables: { id, Active: completed },
		});
	};

	if (loading) return <p>Loading...</p>;
	if (error) {
		console.log("Error :", error.message);
		return <p>Error :(</p>;
	}


	return (
		<Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
			<Box
				component="form"
				sx={{
					"& > :not(style)": { m: 1, width: "25ch" },
				}}
				noValidate
				autoComplete="off"
				onSubmit={handleSubmit}
			>
				<TextField
					id="outlined-basic"
					label="Add Habit"
					variant="outlined"
					value={newHabit}
					onChange={(e) => setNewHabit(e.target.value)}
				/>
				<Button variant="contained" type="submit">
					Add
				</Button>
			</Box>

			<List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
				{data?.habits?.data?.map(({ id, attributes: { Title, Active, Frequency, LastCompleted } }: Habit) => (
					<ListItem key={id} disablePadding>
						<ListItemButton onClick={() => handleComplete(id, !Active)}>
							<ListItemIcon>{Active ? <CheckIcon /> : <CloseIcon />}</ListItemIcon>
							<ListItemText primary={Title} />
						</ListItemButton>
						<ListItemSecondaryAction>
							<IconButton edge="end" aria-label="delete" onClick={() => handleDelete(id)}>
								<DeleteIcon />
							</IconButton>
						</ListItemSecondaryAction>
					</ListItem>
				))}
			</List>
		</Box>
	);
}