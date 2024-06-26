import { Box, Grid, Typography } from '@mui/material';
import React from 'react';
import PlanSelectDropdown from '../Components/PlanSelectDropdown';


interface DayPlanningProps {
	currentView: string;
	setCurrentView: React.Dispatch<React.SetStateAction<string>>;
}

const DayPlanning = (props: DayPlanningProps) => {


	return (
		<Grid container spacing={3}>

			<Grid item xs={12}>
				<Box>

					{/* Plan Select Dropdown */}
					<PlanSelectDropdown currentView={props.currentView} setCurrentView={props.setCurrentView} />


					<Typography variant="h6" component="h2">
						{new Date().toDateString()}
					</Typography>

				</Box>
			</Grid>


			{/* Calendar Section */}
			<Grid item xs={4} sx={{ border: "1px solid black" }}>

				<Grid container spacing={3}>

					<Grid item xs={6} sx={{ border: "1px solid black" }}>
						<Box sx={{ p: 3 }}>
							<Typography variant="h5" component="h1">
								Calendar 2
							</Typography>
						</Box>
					</Grid>

					<Grid item xs={6} sx={{ border: "1px solid black" }}>
						<Box sx={{ p: 3 }}>
							<Typography variant="h5" component="h1">
								Calendar 1
							</Typography>
						</Box>
					</Grid>

				</Grid>

			</Grid>

			{/* Itinirary */}
			<Grid item xs={3} sx={{ border: "1px solid black" }}>
				<Box sx={{ p: 3 }}>
					<Typography variant="h5" component="h1">
						Itinirary
					</Typography>
				</Box>
			</Grid>

			{/* To Do Lists */}
			<Grid item xs={5} sx={{ border: "1px solid black" }}>
				<Box sx={{ p: 3 }}>
					<Typography variant="h5" component="h1">
						To Do Lists
					</Typography>
					<ul>
						<li>Project</li>
						<li>To Do List</li>
					</ul>
				</Box>
			</Grid>

		</Grid>
	)
}

export default DayPlanning