import { Box, Button, Grid, Paper, Typography } from '@mui/material'
import React from 'react'


const PlanningPage = () => {


	return (
		<Grid container spacing={3}>

			<Grid item xs={10} sx={{ paddingBottom: "32px", border: "1px solid black" }}>
				<Typography variant="h5" component="h1">
					Day Planning
				</Typography>
			</Grid>

			<Grid item xs={2} sx={{ border: "1px solid black" }}>
				{/* 3 buttons */}
				<Button variant="contained">Day</Button>
				<Button variant="contained">Week</Button>
				<Button variant="contained">Year</Button>

			</Grid>

			{/* Calendar Desction */}
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

export default PlanningPage