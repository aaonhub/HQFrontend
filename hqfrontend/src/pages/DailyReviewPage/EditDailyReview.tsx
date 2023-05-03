import React, { useState } from 'react';
import { TextField, Box, Button } from '@mui/material';
import DailyReview from '../../models/dailyreview';

interface EditDailyReviewProps {
	onSave: (title: string, gratitudes: string[], majorEvents: string[], details: string) => void
	dailyReview: DailyReview
}

const EditDailyReview: React.FC<EditDailyReviewProps> = ({ onSave, dailyReview }) => {
	const [title, setTitle] = useState(dailyReview.title)
	const [gratitudes, setGratitudes] = useState(dailyReview.gratitudes.join('\n'))
	const [majorEvents, setMajorEvents] = useState(dailyReview.majorEvents.join('\n'))
	const [details, setDetails] = useState(dailyReview.details)

	const handleSave = () => {
		const gratitudesList = gratitudes.split('\n')
		const majorEventsList = majorEvents.split('\n')
		onSave(title, gratitudesList, majorEventsList, details)
	}

	return (
		<Box>

			<TextField
				label="Title"
				fullWidth
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				margin="normal"
			/>

			<TextField
				label="Gratitudes"
				multiline
				rows={4}
				value={gratitudes}
				onChange={(e) => setGratitudes(e.target.value)}
				fullWidth
				margin="normal"
			/>
			<TextField
				label="Major Events"
				multiline
				rows={4}
				value={majorEvents}
				onChange={(e) => setMajorEvents(e.target.value)}
				fullWidth
				margin="normal"
			/>
			<TextField
				label="Details"
				multiline
				rows={4}
				value={details}
				onChange={(e) => setDetails(e.target.value)}
				fullWidth
				margin="normal"
			/>
			<Box mt={2} display="flex" justifyContent="center">
				<Button variant="contained" onClick={handleSave}>
					Save
				</Button>
			</Box>
		</Box>
	);
};

export default EditDailyReview;
