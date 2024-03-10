import { Container, Grid, Typography } from "@mui/material";
import ItineraryCard from "./Components/ItineraryCard";
import { getCustomLocalDate } from "../../components/DateFunctions";
import { useEffect } from "react";

import CalendarCard from "./Components/CalendarCard";
import AccountabilityToDoListDisplay from "./Components/AccountabilityToDoListDisplay";
import StickyNote from "./Components/StickyNote";
import MasterListCard from "./Components/MasterListCard";



const TodayPage = () => {

	// Tab Title
	useEffect(() => {
		document.title = "Today - HQ";
	}, []);

	return (
		<Container maxWidth="xl">
			<Grid container>

				<Grid item xs={12}>
					<Typography variant="h4" sx={{ paddingBottom: 2 }}>
						{getCustomLocalDate()}
					</Typography>
				</Grid>

				<Grid item xs={12} md={6} lg={4}>
					<CalendarCard />
				</Grid>

				<Grid item xs={12} md={6} lg={4}>
					<ItineraryCard />
				</Grid>

				<Grid item xs={12} md={6} lg={4}>
					<MasterListCard />
				</Grid>

				<Grid item xs={12} md={6} lg={6}>
					<AccountabilityToDoListDisplay />
				</Grid>

				<Grid item xs={12} md={6} lg={6}>
					<StickyNote />
				</Grid>


			</Grid>
		</Container>
	);
};

export default TodayPage;
