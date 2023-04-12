import React from "react";
import { Grid, Typography } from "@mui/material";
import { useQuery } from "@apollo/client";

import HabitInboxRosetta from './HabitInboxRosetta';
import {
	GET_TODAY_LIST_ITEMS,
	GET_HABITS_DUE_TODAY
} from "./mainViewQueries";

import Itinerary from "./Itinerary";
import Log from "./Log";
import Calendar from "./Calendar";

import {
	getCurrentLocalDate,
	getCurrentDayOfWeek,
	getCurrentDayOfMonth
} from "../../components/DateFunctions";


const MainView = () => {


	const localDate = getCurrentLocalDate();

	// Today Inbox Query
	const {
		loading: inboxLoading,
		error: inboxError,
		data: inboxData,
	} = useQuery(GET_TODAY_LIST_ITEMS, {
		variables: {
			Today: localDate,
		},
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
		}
	});

	console.log(inboxData);
	console.log(habitsData);

	const habitInboxArray = HabitInboxRosetta({ habits: habitsData, inboxData: inboxData });


	if (inboxLoading || habitsLoading) return <p>Loading...</p>;
	if (inboxError || habitsError) return <p>Error :(</p>;


	return (
		<Grid container sx={{ height: "92vh" }}>

			<Grid item xs={6}>
				<Typography variant="h4">{new Date().toLocaleDateString()}</Typography>
				<Calendar />
			</Grid>

			<Grid item xs={6} container direction="row">

				<Grid item xs={12} style={{ flexGrow: 1 }}>
					<Itinerary habitInboxArray={habitInboxArray} />
				</Grid>

				<Grid item xs={12} style={{ flexGrow: 1 }}>
					<Log />
				</Grid>

			</Grid>

		</Grid>
	);
};

export default MainView;
