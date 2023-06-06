import { Grid, Typography } from "@mui/material";
import Itinerary from "./Itinerary";
import LogList from "./LogList";

const getOrdinalSuffix = (day: number): string => {
	if (day > 3 && day < 21) return 'th';
	switch (day % 10) {
		case 1: return "st";
		case 2: return "nd";
		case 3: return "rd";
		default: return "th";
	}
}

const TodayPage = () => {
	// Get the current date
	const currentDate = new Date();

	// Format each part of the date
	const dayWithSuffix = `${currentDate.getDate()}${getOrdinalSuffix(currentDate.getDate())}`;
	const month = currentDate.toLocaleString(undefined, { month: 'long' });
	const year = currentDate.getFullYear();
	const weekday = currentDate.toLocaleString(undefined, { weekday: 'long' });

	// Combine parts into the final date string
	const customFormattedDate = `${weekday}, ${month} ${dayWithSuffix}, ${year}`;

	return (
		<Grid container>
			{/* Day Display */}
			<Grid item xs={12}>
				<Typography variant="h4" sx={{ paddingBottom: 2 }}>
					{customFormattedDate}
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
