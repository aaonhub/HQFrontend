import React, { useState, useEffect } from "react";
import { Grid, Typography } from "@mui/material";
import { useQuery } from "@apollo/client";

import HabitInboxRosetta from './HabitInboxRosetta';
import Itinerary from "./Itinerary";
import LogList from "./LogList";
// import Calendar from "./Calendar";

import { getCurrentLocalDate } from "../../components/DateFunctions";

// Queries and Mutations
import { GET_TODAY_LIST_ITEMS } from "../../models/inboxitem";
import { GET_HABITS_DUE_TODAY } from "../../models/habit";

// Models
import Habit from "../../models/habit";
import InboxItem from "../../models/inboxitem";
import SimpleItem from "../../models/simpleitem";


const TodayPage = () => {
	const [simpleItemArray, setSimpleItemArray] = useState<SimpleItem[]>([]);
	const [habits, setHabits] = useState<Habit[]>([]);
	const [inboxItems, setInboxItems] = useState<InboxItem[]>([]);
	const localDate = getCurrentLocalDate();


	// Today Inbox Query
	const { loading: inboxLoading, error: inboxError, data: inboxData, } = useQuery(GET_TODAY_LIST_ITEMS, {
		variables: {
			Today: localDate,
		},
		onCompleted: (data) => {
			const inboxItems = data.toDoItems.map((toDoItems: any) => {
				return new InboxItem({
					id: toDoItems.id,
					title: toDoItems.title,
					description: toDoItems.description,
					completed: toDoItems.completed,
					project: toDoItems.project,
					dueDateTime: toDoItems.dueDateTime,
					startDate: toDoItems.startDate,
					startTime: toDoItems.startTime,
					timeCompleted: new Date(toDoItems.timeCompleted),
				})
			})
			setInboxItems(inboxItems)
		}
	});




	// Habits Query
	const {
		loading: habitsLoading,
		error: habitsError,
		data: habitsData,
	} = useQuery(GET_HABITS_DUE_TODAY, {
		variables: { today: localDate },
		onCompleted: (data) => {
			const habits = data.habitsDueToday.map((habit: any) => {
				return new Habit(
					habit.id,
					habit.title,
					habit.active,
					habit.frequency,
					habit.lastCompleted,
					habit.order,
					habit.daysOfTheWeek,
					habit.daysOfTheMonth,
					habit.dayOfTheYear,
					habit.startDate,
					habit.endDate,
					habit.timeOfDay,
					habit.completedToday,
				);
			});
			setHabits(habits);
		},
		onError: (error) => {
			console.log(error)
		}
	});




	useEffect(() => {
		if (habitsData && inboxData) {
			const combinedArray = HabitInboxRosetta({ habits: habits, inboxItems: inboxItems })
			const simpleItemArrayFiltered = combinedArray.filter((simpleItem) => {
				return !simpleItem.completedToday
			})

			setSimpleItemArray(simpleItemArrayFiltered)
		}
	}, [habitsData, inboxData, habits, inboxItems])


	if (inboxLoading || habitsLoading) return <p>Loading...</p>
	if (inboxError || habitsError) return <p>Error :(</p>




	return (
		<Grid container> {/* Adjust the height value as needed */}


			<Grid item xs={12}> {/* Adjust the height value as needed */}
				<Typography variant="h4">
					{new Date().toLocaleDateString()}
				</Typography>
			</Grid>


			<Grid item xs={6}>
				<Grid item xs={12}>
					<Itinerary simpleItemArray={simpleItemArray} setSimpleItemArray={setSimpleItemArray} />
				</Grid>
			</Grid>

			<Grid item xs={6}>
				<Grid item xs={12}>
					<LogList />
				</Grid>
			</Grid>

		</Grid>
	);
};

export default TodayPage;
