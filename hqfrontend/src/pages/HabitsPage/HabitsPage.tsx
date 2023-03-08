import * as React from 'react';
import Button from '@mui/material/Button';
import AddHabitPopup from './AddHabitPopUp';
import { useQuery } from '@apollo/client';
import { GET_HABITS } from './habitsQueries';
import HabitList from './HabitList';
import { useState } from 'react';


export default function HabitsPage() {
	const [habits, setHabits] = useState<any[]>([]);

	const [open, setOpen] = React.useState(false);
	const handleClickOpen = () => {
		setOpen(true);
	};
	const handleClose = () => {
		setOpen(false);

		//wait for the mutation to complete
		setTimeout(() => { refetch() }, 1000);
	};

	// habit query sets habits state
	const { loading, error, refetch } = useQuery(GET_HABITS, {
		onCompleted: (data) => {
			console.log(data.habits.data);
			setHabits(data.habits.data);
		},
	});

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error :(</p>;



	return (
		<div>
			<AddHabitPopup open={open} onClose={handleClose} />
			<Button variant="outlined" onClick={handleClickOpen}>Add Habit</Button>

			<HabitList habits={habits} setHabits={setHabits} refetch={refetch} />
		</div>
	);
}
