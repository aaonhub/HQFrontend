import { useEffect, useState } from 'react'
import './DailyReviewPage.css'
import { Container, Typography, Grid } from '@mui/material'
import { useQuery } from '@apollo/client'

import DisplayDailyReview from './2DisplayDailyReview'
import EditDailyReview from './2EditDailyReview'
import DailyReviewList from './2DailyReviewList'
import { currentYYYYMMDD } from '../../components/DateFunctions'

// Queries and Mutations
import { GET_DAILY_REVIEWS, GET_DAILY_REVIEW_BY_DATE } from '../../models/dailyreview'

// Models
import DailyReview from '../../models/dailyreview'



const DailyReviewPage = () => {
	useEffect(() => {
		document.title = "Reviews - HQ";
	}, []);
	
	const [today, setToday] = useState(currentYYYYMMDD())
	const [editMode, setEditMode] = useState(false)
	const [dailyReview, setDailyReview] = useState<DailyReview>(new DailyReview({
		id: '',
		title: '',
		details: '',
		gratitudes: [],
		majorEvents: [],
		date: today,
	}))


	const { loading: dailyReviewLoading, error: dailyReviewError } = useQuery(GET_DAILY_REVIEW_BY_DATE, {
		variables: { date: today },
		fetchPolicy: 'network-only',
		onCompleted: (data) => {
			if (!data.dailyReviews[0]) {
				setDailyReview(
					new DailyReview({
						id: '',
						title: '',
						details: '',
						gratitudes: [],
						majorEvents: [],
						date: today,
					})
				);
				setEditMode(true);
			} else {
				setDailyReview(
					new DailyReview({
						id: data.dailyReviews[0].id,
						title: data.dailyReviews[0].title,
						details: data.dailyReviews[0].details,
						gratitudes: JSON.parse(data.dailyReviews[0].gratitudeList),
						majorEvents: JSON.parse(data.dailyReviews[0].majorEvents),
						date: data.dailyReviews[0].date,
					})
				);
				setEditMode(false);
			}
		},
	})

	const { loading: dailyReviewsLoading, data: dailyReviewsData, refetch } = useQuery(GET_DAILY_REVIEWS, {
		fetchPolicy: 'network-only',
	});



	if (dailyReviewError) return <Typography>Error! {dailyReviewError.message}</Typography>

	return (
		<Container maxWidth="xl" className="daily-review-page">
			<Grid container spacing={2}>


				{/* Left Side */}
				<DailyReviewList
					today={today}
					setToday={setToday}
					editMode={editMode}
					setEditMode={setEditMode}
					data={dailyReviewsData}
					loading={dailyReviewsLoading}
				/>


				{/* Vertical Divider */}
				<Grid item>
					<div className="vertical-divider" />
				</Grid>


				{/* Right Side */}
				{dailyReviewLoading ?
					<Typography>Loading...</Typography>
					:
					< Grid xs={8} item>
						<div className="right-side">
							{!editMode ? (
								<DisplayDailyReview dailyReview={dailyReview} />
							) : (
								<EditDailyReview
									dailyReview={dailyReview}
									setDailyReview={setDailyReview}
									setEditMode={setEditMode}
									today={today}
									loading={dailyReviewLoading}
									refetch={refetch}
								/>
							)}
						</div>
					</Grid>
				}
			</Grid>
		</Container >
	)
}

export default DailyReviewPage
