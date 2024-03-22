import { Container, Grid, Typography, IconButton } from "@mui/material";
import ItineraryCard from "./Components/ItineraryCard";
import { getCustomLocalDate, yyyymmddToDate, dateToYYYYMMDD } from "../../components/DateFunctions";
import { useEffect, useState } from "react";
import CalendarCard from "./Components/CalendarCard";
import AccountabilityToDoListDisplay from "./Components/AccountabilityToDoListDisplay";
import StickyNote from "./Components/StickyNote";
import MasterListCard from "./Components/MasterListCard";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const TodayPage = () => {
	// Tab Title
	useEffect(() => {
		document.title = "Today - HQ";
	}, []);

	const [selectedDate, setSelectedDate] = useState(new Date());

	const handlePreviousDay = () => {
		const previousDay = new Date(selectedDate);
		previousDay.setDate(selectedDate.getDate() - 1);
		setSelectedDate(previousDay);
	};

	const handleNextDay = () => {
		const nextDay = new Date(selectedDate);
		nextDay.setDate(selectedDate.getDate() + 1);
		setSelectedDate(nextDay);
	};

	return (
		<Container maxWidth="xl">
			<Grid container>

				{/* Date Display */}
				<Grid item xs={12}>
					<Typography variant="h4" sx={{ paddingBottom: 2 }}>
						<IconButton onClick={handlePreviousDay}>
							<ArrowBackIosIcon />
						</IconButton>
						{getCustomLocalDate(selectedDate)}
						<IconButton onClick={handleNextDay}>
							<ArrowForwardIosIcon />
						</IconButton>
					</Typography>
				</Grid>

				{/* Calendar */}
				<Grid item xs={12} md={6} lg={4}>
					<CalendarCard selectedDate={dateToYYYYMMDD(selectedDate)} />
				</Grid>

				{/* Itinerary */}
				<Grid item xs={12} md={6} lg={4}>
					<ItineraryCard selectedDate={dateToYYYYMMDD(selectedDate)} />
				</Grid>

				{/* Master List */}
				<Grid item xs={12} md={6} lg={4}>
					<MasterListCard />
				</Grid>

				{/* Accountability To Do List */}
				<Grid item xs={12} md={6} lg={6}>
					<AccountabilityToDoListDisplay selectedDate={dateToYYYYMMDD(selectedDate)} />
				</Grid>

				{/* Sticky Note */}
				<Grid item xs={12} md={6} lg={6}>
					<StickyNote />
				</Grid>


			</Grid>
		</Container>
	);
};

export default TodayPage;