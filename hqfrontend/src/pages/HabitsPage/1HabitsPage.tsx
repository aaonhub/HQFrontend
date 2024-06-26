// import * as React from 'react';
import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { Container, Typography, Box } from '@mui/material';
import { useQuery } from '@apollo/client';

// Queries and Mutations
import { GET_HABITS_DUE_TODAY } from '../../models/habit';

// Components
import HabitList from './HabitList';
import AddHabitPopup from './AddHabitPopUp';
import { currentYYYYMMDD } from '../../components/DateFunctions';

// Models
import Habit from '../../models/habit';
import Schedule from '../../models/schedule';
import HabitManagerDialog from './HabitManager';


const HabitsPage: React.FC = () => {

	// Tab Title
	useEffect(() => {
		document.title = "Habits - HQ";
	}, []);

	const [habits, setHabits] = useState<Habit[]>([])
	const [today, setToday] = useState(currentYYYYMMDD())
	const [open, setOpen] = useState(false)
	const [habitManagerDialogOpen, setHabitManagerDialogOpen] = useState(false)

	// Habits Query
	const { loading, error, refetch } = useQuery(GET_HABITS_DUE_TODAY, {
		variables: { today: today, },
		fetchPolicy: "network-only",
		onCompleted: (data) => {
			const habits = data.habitsDueToday.map((habit: any) => {

				// Create Schedule
				const schedule = new Schedule({
					id: habit.schedules.id,
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
					contentId: habit.schedules.contentId,
					priority: habit.schedules.priority
				})

				// Create Habit
				return new Habit({
					id: habit.id,
					title: habit.title,
					active: habit.active,
					length: habit.length,
					schedule: schedule,
					countToday: habit.countOnDate,
				});


			});
			setHabits(habits);
		},
		onError: (error) => {
			console.error(error);
		}
	});



	const handleClickOpen = () => {
		setOpen(true)
	};
	const handleClose = () => {
		setOpen(false)
		refetch()
	};




	const previousDay = () => {
		const [year, month, day] = today.split("-");
		const currentDate = new Date(Number(year), Number(month) - 1, Number(day));
		currentDate.setDate(currentDate.getDate() - 1);
		const newDateString = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, "0")}-${currentDate.getDate().toString().padStart(2, "0")}`;
		setToday(newDateString);
	};

	const nextDay = () => {
		const [year, month, day] = today.split("-");
		const currentDate = new Date(Number(year), Number(month) - 1, Number(day));
		currentDate.setDate(currentDate.getDate() + 1);
		const newDateString = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, "0")}-${currentDate.getDate().toString().padStart(2, "0")}`;
		setToday(newDateString);
	};

	const goToToday = () => {
		setToday(currentYYYYMMDD());
	};



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
					{today === currentYYYYMMDD() ? "Today, " + today : today}
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

			{/* Habit Manager Button */}
			<Box display="flex" justifyContent="center" mb={4}>
				<Button variant="outlined" onClick={() => setHabitManagerDialogOpen(true)} sx={{ mr: 2 }}>
					Habit Manager
				</Button>
			</Box>

			{/* Add Habit Button */}
			<Box display="flex" justifyContent="center" mb={4}>
				<Button variant="outlined" onClick={handleClickOpen}>
					Add Habit
				</Button>
			</Box>

			{/* Habit list */}
			<HabitList habits={habits} today={today} handleClose={handleClose} />

			{/* Habit Popup */}
			<AddHabitPopup open={open} onClose={handleClose} />

			{/* Habit Manager Dialog */}
			{habitManagerDialogOpen &&
				<HabitManagerDialog handleClose={() => setHabitManagerDialogOpen(false)} />
			}


		</Container>
	)
}

export default HabitsPage