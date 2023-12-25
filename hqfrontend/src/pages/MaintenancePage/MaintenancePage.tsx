import { Card, Grid, Typography } from '@mui/material'
import React from 'react'
import SocialHealthCard from './components/SocialHealth'
import ShelterCard from './components/ShelterCard'
import MentalHealthCard from './components/MentalHealthCard'
import DietCard from './components/DietCard'
import SleepCard from './components/SleepCard'
import ExerciseCard from './components/ExerciseCard'
import HygieneCard from './components/HygieneCard'



const MaintenancePage = () => {


	return (
		<Grid container spacing={2}>

			<Grid item xs={12} md={12}>
				<Typography variant="h3">Maintenance Page</Typography>
			</Grid>

			<Grid item xs={4} md={4}>
				<ExerciseCard />
			</Grid>

			<Grid item xs={4} md={4}>
				<SleepCard />
			</Grid>

			<Grid item xs={4} md={4}>
				<DietCard />
			</Grid>

			<Grid item xs={4} md={4}>
				<MentalHealthCard />
			</Grid>

			<Grid item xs={4} md={4}>
				<SocialHealthCard />
			</Grid>

			<Grid item xs={4} md={4}>
				<ShelterCard />
			</Grid>

			<Grid item xs={4} md={4}>
				<HygieneCard />
			</Grid>

		</Grid>

	)
}

export default MaintenancePage