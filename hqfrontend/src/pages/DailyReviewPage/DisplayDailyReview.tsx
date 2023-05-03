import React from 'react';
import { Typography, Box } from '@mui/material';
import DailyReview from '../../models/dailyreview';

interface DisplayDailyReviewProps {
	dailyReview: DailyReview;
}

const DisplayDailyReview: React.FC<DisplayDailyReviewProps> = ({ dailyReview }) => {
	return (
		<Box sx={{ p: 2 }}>


			{/* Title */}
			{dailyReview.title === '' ?
				<Typography variant="h4">untitled</Typography>
				:
				<Typography variant="h4">{dailyReview.title}</Typography>
			}


			{/* Gratitudes */}
			<Typography variant="body1">Gratitudes:</Typography>
			<ul>
				{dailyReview.gratitudes.map((item: string, index: number) => (
					<li key={index}>{item}</li>
				))}
			</ul>


			{/* Major Events */}
			<Typography variant="body1">Major Events:</Typography>
			<ul>
				{dailyReview.majorEvents.map((item: string, index: number) => (
					<li key={index}>{item}</li>
				))}
			</ul>


			{/* Details */}
			<Typography variant="body1">Details: {dailyReview.details}</Typography>


		</Box>
	);
};

export default DisplayDailyReview;
