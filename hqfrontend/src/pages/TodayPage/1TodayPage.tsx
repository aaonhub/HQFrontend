import { Grid, Typography } from "@mui/material";

import Itinerary from "./Itinerary";
import LogList from "./LogList";
// import Calendar from "./Calendar";




const TodayPage = () => {



	return (
		<Grid container>


			{/* Day Display */}
			<Grid item xs={12}>
				<Typography variant="h4">
					{new Date().toLocaleDateString()}
				</Typography>
			</Grid>

			{/* Left Log List */}
			<Grid item xs={6}>
				<Itinerary />
			</Grid>

			{/* Right side */}
			<Grid item xs={6}>
				<Grid item xs={12}>
					<LogList />
				</Grid>
			</Grid>

		</Grid>
	);
};

export default TodayPage;
