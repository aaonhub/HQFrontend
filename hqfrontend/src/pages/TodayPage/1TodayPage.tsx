import React, { useState, useEffect } from "react";
import { Grid, Typography } from "@mui/material";
import { useQuery } from "@apollo/client";

import HabitInboxRosetta from './HabitInboxRosetta';
import Itinerary from "./Itinerary";
import LogList from "./LogList";
import Calendar from "./Calendar";

import {
	getCurrentLocalDate,
	getCurrentDayOfWeek,
	getCurrentDayOfMonth
} from "../../components/DateFunctions";

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
			const inboxItemsData = data.toDoItems.data
			const inboxItems = inboxItemsData.map((inboxItem: any) => {
				return new InboxItem({
					id: inboxItem.id,
					title: inboxItem.attributes.Title,
					description: inboxItem.attributes.Description,
					completed: inboxItem.attributes.Completed,
					project: inboxItem.attributes.Project,
					dueDateTime: inboxItem.attributes.DueDateTime,
					startDate: inboxItem.attributes.StartDate,
					startTime: inboxItem.attributes.startTime,
					timeCompleted: new Date(inboxItem.attributes.TimeCompleted),
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
		variables: {
			today: localDate,
			daily: { "eq": "Daily" },
			weekly: { "eq": "Weekly" },
			monthly: { "eq": "Monthly" },
			dayOfWeek: getCurrentDayOfWeek(),
			dayOfMonth: getCurrentDayOfMonth(),
		},
		onCompleted: (data1) => {
			const habitsData = data1.habits.data;
			const habits = habitsData.map((habit: any) => {
				const habitHistories = habit.attributes.habit_histories.data || [];

				// Check if there is any habit_history with Completed set to true
				const completedToday = habitHistories.some(
					(history: any) => history.attributes.Completed
				);

				return new Habit(
					habit.id,
					habit.attributes.Title,
					habit.attributes.Description,
					habit.attributes.Active,
					habit.attributes.Frequency,
					habit.attributes.LastCompleted,
					habit.attributes.Order,
					habit.attributes.HabitFrequency,
					completedToday
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
		<Grid container sx={{ height: "92vh" }}>

			<Grid item xs={6}>
				<Typography variant="h4">{new Date().toLocaleDateString()}</Typography>
				<Calendar />
			</Grid>

			<Grid item xs={6} container direction="row">

				<Grid item xs={12} style={{ flexGrow: 1 }}>
					<Itinerary simpleItemArray={simpleItemArray} setSimpleItemArray={setSimpleItemArray} />
				</Grid>

				<Grid item xs={12} style={{ flexGrow: 1 }}>
					<LogList />
				</Grid>

			</Grid>

		</Grid>
	);
};

export default TodayPage;
