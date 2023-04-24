// import * as React from 'react';
import { useState } from 'react';
import Button from '@mui/material/Button';
import { Container, Typography, Box } from '@mui/material';
import { useQuery } from '@apollo/client';

// Queries and Mutations
import { GET_HABITS_DUE_TODAY } from '../../models/habit';

// Components
import HabitList from './HabitList';
import AddHabitPopup from './AddHabitPopUp';
import { getCurrentLocalDate, getCurrentDayOfWeek, getCurrentDayOfMonth } from '../../components/DateFunctions';

// Models
import Habit from '../../models/habit';

const HabitsPage = () => {
	const [habits, setHabits] = useState<Habit[]>([]);
	const [today, setToday] = useState(getCurrentLocalDate());
	const [open, setOpen] = useState(false);


	const handleClickOpen = () => {
		setOpen(true);
	};
	const handleClose = () => {
		setOpen(false);

		//wait for the mutation to complete
		setTimeout(() => { refetch() }, 1000);
	};


	const previousDay = () => {
		const [year, month, day] = today.split("-");
		const newDay = Number(day) - 1;
		const newDateString = `${year}-${month}-${newDay.toString().padStart(2, "0")}`;
		setToday(newDateString);
	};
	const nextDay = () => {
		const [year, month, day] = today.split("-");
		const newDay = Number(day) + 1;
		const newDateString = `${year}-${month}-${newDay.toString().padStart(2, "0")}`;
		setToday(newDateString);
	};
	const goToToday = () => {
		setToday(getCurrentLocalDate());
	};


	// Habits Query
	const { loading, error, refetch } = useQuery(GET_HABITS_DUE_TODAY, {
		variables: {
			today: today,
			daily: { "eq": "Daily" },
			weekly: { "eq": "Weekly" },
			monthly: { "eq": "Monthly" },
			dayOfWeek: getCurrentDayOfWeek(),
			dayOfMonth: getCurrentDayOfMonth(),
		},
		onCompleted: (data) => {
			const habits1 = data.habits.data.map((habit: any) => {
				const habit_histories = habit.attributes.habit_histories.data.map((history: { attributes: { Date: any; Completed: any; }; }) => {
					return {
						date: history.attributes.Date,
						completed: history.attributes.Completed
					};
				});

				return new Habit(
					habit.id,
					habit.attributes.Title,
					habit.attributes.Active,
					habit.attributes.Frequency,
					habit.attributes.LastCompleted,
					habit.Order,
					habit.attributes.HabitFrequency,
					habit_histories,
					habit_histories.length > 0 ? habit_histories[habit_histories.length - 1].completed : false,
				);
			});
			setHabits(habits1);
		},
	});
	


	if (loading) return <Typography>Loading...</Typography>;
	if (error) return <Typography>Error :(</Typography>;

	return (
		<Container maxWidth="md">
			<Box mt={4} mb={4}>
				<Typography variant="h4" align="center">
					Habits Tracker
				</Typography>
			</Box>

			{/* Date Display */}
			<Box mt={4} mb={4}>
				<Typography variant="h5" align="center">
					{today === getCurrentLocalDate() ? "Today, " + today : today}
				</Typography>
			</Box>

			{/* Date Controls */}
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

			{/* Add Habit Button */}
			<Box display="flex" justifyContent="center" mb={4}>
				<Button variant="outlined" onClick={handleClickOpen}>
					Add Habit
				</Button>
			</Box>

			{/* Habit list */}
			<HabitList refetch={refetch} habits={habits} />

			{/* Habit Popup */}
			<AddHabitPopup open={open} onClose={handleClose} />
		</Container>
	)
}

export default HabitsPage