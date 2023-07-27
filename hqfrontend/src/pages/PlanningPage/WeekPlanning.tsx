import { Box, Grid, Typography } from '@mui/material'
import React from 'react'
import PlanSelectDropdown from "./PlanSelectDropdown";

interface WeekPlanningProps {
	setCurrentView: React.Dispatch<React.SetStateAction<string>>;
}

const WeekPlanning = ({ setCurrentView }: WeekPlanningProps) => {


	return (
		<Grid container spacing={3}>

			<Grid item xs={12}>
				<Box>


					{/* Plan Select Dropdown */}
					<PlanSelectDropdown setCurrentView={setCurrentView} />


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
