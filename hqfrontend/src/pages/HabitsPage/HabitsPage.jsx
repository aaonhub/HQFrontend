import * as React from 'react';
import { useState } from 'react';
import Button from '@mui/material/Button';
import { Container, Typography, Box } from '@mui/material';
import AddHabitPopup from './AddHabitPopUp';
import { useQuery } from '@apollo/client';
import { GET_HABITS } from './habitsQueries';
import HabitList from './HabitList';

const HabitsPage = () => {
	const [habits, setHabits] = useState([]);
	const [today, setToday] = useState(new Date().toISOString().split("T")[0]);
	const [open, setOpen] = React.useState(false);


	const handleClickOpen = () => {
		setOpen(true);
	};
	const handleClose = () => {
		setOpen(false);

		//wait for the mutation to complete
		setTimeout(() => { refetch() }, 1000);
	};

	const previousDay = () => {
		const currentDate = new Date(today);
		currentDate.setDate(currentDate.getDate() - 1);
		setToday(currentDate.toISOString().split("T")[0]);
	};
	const nextDay = () => {
		const currentDate = new Date(today);
		currentDate.setDate(currentDate.getDate() + 1);
		setToday(currentDate.toISOString().split("T")[0]);
	};
	const goToToday = () => {
		setToday(new Date().toISOString().split("T")[0]);
	};


	// habit query sets habits state
	const { loading, error, refetch } = useQuery(GET_HABITS, {
		variables: {
			Today: today
		},
		onCompleted: (data) => {
			console.log(data.habits.data);
			setHabits(data.habits.data);
		},
	});


	if (loading) return <Typography>Loading...</Typography>;
	if (error) return <Typography>Error :(</Typography>;

	console.log(today)

	return (
		<Container maxWidth="md">
			<Box mt={4} mb={4}>
				<Typography variant="h4" align="center">
					Habits Tracker
				</Typography>
			</Box>

			<Box mt={4} mb={4}>
				<Typography variant="h5" align="center">
					{today === new Date().toISOString().split("T")[0] ? "Today, " + today : today}
				</Typography>
			</Box>

			<Box display="flex" justifyContent="center" mb={4}>
				<Button variant="outlined" onClick={previousDay} sx={{ mr: 2 }}>
					Previous Day
				</Button>
				<Button variant="outlined" onClick={goToToday} sx={{ mr: 2 }}>
					Today
				</Button>
				<Button variant="outlined" onClick={nextDay} sx={{ mr: 2 }}>
					Next Day
				</Button>
			</Box>

			<Box display="flex" justifyContent="center" mb={4}>
				<Button variant="outlined" onClick={handleClickOpen}>
					Add Habit
				</Button>
			</Box>

			<AddHabitPopup open={open} onClose={handleClose} />
			<HabitList refetch={refetch} habits={habits} />
		</Container>
	)
}

export default HabitsPage