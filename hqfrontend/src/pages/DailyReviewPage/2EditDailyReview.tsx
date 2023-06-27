import React, { useState, useEffect } from 'react';
import { TextField, Box, Button } from '@mui/material';
import { useMutation } from '@apollo/client';
import { useGlobalContext } from '../../pages/App/GlobalContextProvider';

// Models
import DailyReview from '../../models/dailyreview';

// Queries and Mutations
import { UPDATE_DAILY_REVIEW } from '../../models/dailyreview'
import { CREATE_DAILY_REVIEW } from '../../models/dailyreview'
import { getCurrentLocalDate } from '../../components/DateFunctions';


interface EditDailyReviewProps {
	dailyReview: DailyReview
	setDailyReview: React.Dispatch<React.SetStateAction<DailyReview>>
	setEditMode: React.Dispatch<React.SetStateAction<boolean>>
	today: string
	loading: any
	refetch: any
}

const EditDailyReview: React.FC<EditDailyReviewProps> = ({ dailyReview, setDailyReview, setEditMode, today, loading, refetch }) => {
	const {setDailyReviewBadgeCount} = useGlobalContext()
	const [title, setTitle] = useState(dailyReview.title)
	const [gratitudes, setGratitudes] = useState(dailyReview.gratitudes.join('\n'))
	const [majorEvents, setMajorEvents] = useState(dailyReview.majorEvents.join('\n'))
	const [details, setDetails] = useState(dailyReview.details)


	// Use useEffect to update state variables when dailyReview changes
	useEffect(() => {
		setTitle(dailyReview.title);
		setGratitudes(dailyReview.gratitudes.join('\n'));
		setMajorEvents(dailyReview.majorEvents.join('\n'));
		setDetails(dailyReview.details);
	}, [dailyReview]);


	const handleSave = () => {
		const gratitudesList = gratitudes.split('\n')
		const majorEventsList = majorEvents.split('\n')
		onSave(title, gratitudesList, majorEventsList, details)
	}

	const [createDailyReview] = useMutation(CREATE_DAILY_REVIEW, {
		onCompleted: (data) => {
			setDailyReview(
				new DailyReview({
					id: data.createDailyReview.dailyReview.id,
					title: data.createDailyReview.dailyReview.title,
					details: data.createDailyReview.dailyReview.details,
					gratitudes: JSON.parse(data.createDailyReview.dailyReview.gratitudeList),
					majorEvents: JSON.parse(data.createDailyReview.dailyReview.majorEvents),
					date: data.createDailyReview.dailyReview.date,
				})
			)
			setEditMode(false)
		},
	})
	const [updateDailyReview] = useMutation(UPDATE_DAILY_REVIEW, {
		onCompleted: (data) => {
			setDailyReview(
				new DailyReview({
					id: data.updateDailyReview.dailyReview.id,
					title: data.updateDailyReview.dailyReview.title,
					details: data.updateDailyReview.dailyReview.details,
					gratitudes: JSON.parse(data.updateDailyReview.dailyReview.gratitudeList),
					majorEvents: JSON.parse(data.updateDailyReview.dailyReview.majorEvents),
					date: data.updateDailyReview.dailyReview.date,
				})
			)
			setEditMode(false)
		},
	})

	const onSave = (title: string, gratitudes: string[], majorEvents: string[], details: string) => {
		if (dailyReview.id) {
			updateDailyReview({
				variables: {
					id: dailyReview.id,
					title: title,
					gratitudeList: JSON.stringify(gratitudes),
					majorEvents: JSON.stringify(majorEvents),
					details: details,
				},
			});
		} else {
			createDailyReview({
				variables: {
					title: title,
					gratitudeList: JSON.stringify(gratitudes),
					majorEvents: JSON.stringify(majorEvents),
					details: details,
					date: today,
				},
			});
			if (getCurrentLocalDate() === today) setDailyReviewBadgeCount(false)
		}
		refetch()
	}

	if (loading) return <p>Loading...</p>

	return (
		<Box>

			{/* Title */}
			<TextField
				label="Title"
				fullWidth
				value={title}
				autoComplete="off"
				onChange={(e) => setTitle(e.target.value)}
				margin="normal"
			/>

			{/* Gratitudes */}
			<TextField
				label="Gratitudes"
				multiline
				rows={4}
				value={gratitudes}
				autoComplete="off"
				onChange={(e) => setGratitudes(e.target.value)}
				fullWidth
				margin="normal"
			/>

			{/* Major Events */}
			<TextField
				label="Major Events"
				multiline
				rows={4}
				value={majorEvents}
				autoComplete="off"
				onChange={(e) => setMajorEvents(e.target.value)}
				fullWidth
				margin="normal"
			/>

			{/* Details */}
			<TextField
				label="Details"
				multiline
				minRows={4}
				maxRows={32}
				value={details}
				autoComplete="off"
				onChange={(e) => setDetails(e.target.value)}
				fullWidth
				margin="normal"
			/>

			{/* Save Button */}
			<Box mt={2} display="flex" justifyContent="center">
				<Button variant="contained" onClick={handleSave}>
					Save
				</Button>
			</Box>

		</Box>
	);
};

export default EditDailyReview;
