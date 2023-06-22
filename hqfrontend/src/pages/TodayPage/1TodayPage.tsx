import { Container, Grid, Typography } from "@mui/material";
import Itinerary from "./Itinerary/Itinerary";
import LogList from "./LogList";
import { getCustomLocalDate } from "../../components/DateFunctions";
import { useEffect } from "react";



const TodayPage = () => {
	// Tab Title
	useEffect(() => {
		document.title = "Today - HQ";
	}, []);

	return (
		<Container>
			<Grid container>
				{/* Day Display */}
				<Grid item xs={12}>
					<Typography variant="h4" sx={{ paddingBottom: 2 }}>
						{getCustomLocalDate()}
					</Typography>
				</Grid>

				{/* Left Side */}
				<Grid item xs={12}>
					<Itinerary />
				</Grid>

				{/* Right side */}
				<Grid item xs={6}>
					{/* <LogList /> */}
				</Grid>
			</Grid>
		</Container>
	);
};

export default TodayPage;
