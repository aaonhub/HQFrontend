import { Container, Grid, Typography, IconButton } from "@mui/material";
import ItineraryCard from "./Components/ItineraryCard";
import { getCustomLocalDate, yyyymmddToDate, dateToYYYYMMDD, currentYYYYMMDD } from "../../components/DateFunctions";
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

	const [selectedDate, setSelectedDate] = useState(currentYYYYMMDD());

	const handlePreviousDay = () => {
		const previousDay = yyyymmddToDate(selectedDate);
		previousDay.setDate(previousDay.getDate() - 1);
		setSelectedDate(dateToYYYYMMDD(previousDay));
	};

	const handleNextDay = () => {
		const nextDay = yyyymmddToDate(selectedDate);
		nextDay.setDate(nextDay.getDate() + 1);
		setSelectedDate(dateToYYYYMMDD(nextDay));
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
						{getCustomLocalDate(yyyymmddToDate(selectedDate))}
						<IconButton onClick={handleNextDay}>
							<ArrowForwardIosIcon />
						</IconButton>
					</Typography>
				</Grid>

				{/* Calendar */}
				<Grid item xs={12} md={6} lg={4}>
					<CalendarCard selectedDate={selectedDate} />
				</Grid>

				{/* Itinerary */}
				<Grid item xs={12} md={6} lg={4}>
					<ItineraryCard selectedDate={selectedDate} />
				</Grid>

				{/* Master List */}
				<Grid item xs={12} md={6} lg={4}>
					<MasterListCard />
				</Grid>

				{/* Accountability To Do List */}
				<Grid item xs={12} md={6} lg={6}>
					<AccountabilityToDoListDisplay selectedDate={selectedDate} />
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