import React from 'react';
import { Typography, Box, Card, CardContent, List, ListItem, Divider } from '@mui/material';
import DailyReview from '../../models/dailyreview';

interface DisplayDailyReviewProps {
	dailyReview: DailyReview;
}

const DisplayDailyReview: React.FC<DisplayDailyReviewProps> = ({ dailyReview }) => {
	const { title, gratitudes, majorEvents, details } = dailyReview;
	const formattedTitle = title || 'untitled';

	return (
		<Card variant="outlined" sx={{ p: 2, mt: 3, mb: 5 }}>
			<CardContent>

				<Typography variant="h4" gutterBottom>
					{formattedTitle}
				</Typography>

				<Box sx={{ mt: 3, mb: 3 }}>
					<Typography variant="subtitle1" color="text.secondary">
						Gratitudes:
					</Typography>
					<List>
						{gratitudes.map((item, index) => (
							<ListItem key={index}>
								<Box component="span" sx={{ pr: 2 }}>&bull;</Box>
								{item}
							</ListItem>
						))}
					</List>
				</Box>

				<Divider variant="middle" />

				<Box sx={{ mt: 3, mb: 3 }}>
					<Typography variant="subtitle1" color="text.secondary">
						Major Events:
					</Typography>
					<List>
						{majorEvents.map((item, index) => (
							<ListItem key={index}>
								<Box component="span" sx={{ pr: 2 }}>&bull;</Box>
								{item}
							</ListItem>
						))}
					</List>
				</Box>

				<Divider variant="middle" />

				<Box sx={{ mt: 3 }}>
					<Typography variant="subtitle1" color="text.secondary">
						Details:
					</Typography>
					<Typography variant="body1" sx={{ mt: 2 }}>
						{details}
					</Typography>
				</Box>

			</CardContent>
		</Card>
	);
};

export default DisplayDailyReview;
