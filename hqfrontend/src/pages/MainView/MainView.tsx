import React from "react";
import { Grid, Typography } from "@mui/material";
import { useQuery } from "@apollo/client";

import { GET_TODAY_LIST_ITEMS } from "./mainViewQueries";
import Itinerary from "./Itinerary";
import Log from "./Log";
import Calendar from "./Calendar";


const MainView: React.FC = () => {

	function getCurrentLocalDate() {
		const now = new Date();
		const year = now.getFullYear();
		const month = String(now.getMonth() + 1).padStart(2, '0');
		const day = String(now.getDate()).padStart(2, '0');

		return `${year}-${month}-${day}`;
	}

	const localDate = getCurrentLocalDate();

	const { loading, error, data } = useQuery(GET_TODAY_LIST_ITEMS, {
		variables: {
			Today: localDate,
		},
	});

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error :(</p>;

	return (
		<Grid container sx={{ height: "92vh" }}>

			<Grid item xs={6}>
				{/* <Typography variant="h4">{new Date().toLocaleDateString()}</Typography> */}
				<Calendar />
			</Grid>

			<Grid item xs={6} container direction="row">

				<Grid item xs={12} style={{ flexGrow: 1 }}>
					<Itinerary data={data} />
				</Grid>

				<Grid item xs={12} style={{ flexGrow: 1 }}>
					<Log />
				</Grid>

			</Grid>

		</Grid>
	);
};

export default MainView;
