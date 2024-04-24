import { Box, Grid, Typography } from '@mui/material'
import React from 'react'
import PlanSelectDropdown from '../Components/PlanSelectDropdown';

interface WeekPlanningProps {
	currentView: string;
	setCurrentView: React.Dispatch<React.SetStateAction<string>>;
}

const WeekPlanning = (props: WeekPlanningProps) => {


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

			<Grid item xs={10} sx={{ border: "1px solid black" }}>
				<Typography variant="h6" component="h2">
					Stuff
				</Typography>
			</Grid>

		</Grid>
	)
}

export default WeekPlanning
