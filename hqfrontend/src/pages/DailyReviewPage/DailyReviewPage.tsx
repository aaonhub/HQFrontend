import React, { useState } from 'react';
import './DailyReviewPage.css';
import { Container, Typography, Box, Button, Grid, List, ListItem, ListItemText } from '@mui/material';
import { useQuery, useMutation } from '@apollo/client';
import { format, sub } from 'date-fns';

import { formatDateWithWeekday, getCurrentLocalDate } from '../../components/DateFunctions';
import {
	GET_DAILY_REVIEW_BY_DATE,
	CREATE_DAILY_REVIEW,
	UPDATE_DAILY_REVIEW,
	GET_DAILY_REVIEWS,
} from '../../models/dailyreview';
import DailyReview from '../../models/dailyreview';
import DisplayDailyReview from './DisplayDailyReview';
import EditDailyReview from './EditDailyReview';

const DailyReviewPage = () => {
	const [today, setToday] = useState(getCurrentLocalDate());
	const [editMode, setEditMode] = useState(false);
	const [dailyReview, setDailyReview] = useState<DailyReview>(new DailyReview({
		id: '',
		title: '',
		details: '',
		gratitudes: [],
		majorEvents: [],
		date: today,
	}));


	const { loading: dailyReviewLoading, error: dailyReviewError, } = useQuery(GET_DAILY_REVIEW_BY_DATE, {
		variables: { date: today },
		onCompleted: (data) => {
			if (!data.dailyReviews.data[0]) {
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
						id: data.dailyReviews.data[0].id,
						title: data.dailyReviews.data[0].attributes.Title,
						details: data.dailyReviews.data[0].attributes.Details,
						gratitudes: data.dailyReviews.data[0].attributes.GratitudeList,
						majorEvents: data.dailyReviews.data[0].attributes.MajorEvents,
						date: data.dailyReviews.data[0].attributes.Date,
					})
				);
				setEditMode(false);
			}
		},
	});
	const { loading: dailyReviewsLoading, data: dailyReviewsData } = useQuery(GET_DAILY_REVIEWS, {
		onCompleted: (data) => {
			console.log(data)
		},
	});



	const goToToday = () => {
		setToday(getCurrentLocalDate());
		console.log(today)
	};


	const [createDailyReview] = useMutation(CREATE_DAILY_REVIEW, {
		onCompleted: (data) => {
			console.log(data)
			setDailyReview(
				new DailyReview({
					id: data.createDailyReview.id,
					title: data.createDailyReview.attributes.Title,
					details: data.createDailyReview.attributes.Details,
					gratitudes: data.createDailyReview.attributes.GratitudeList,
					majorEvents: data.createDailyReview.attributes.MajorEvents,
					date: data.createDailyReview.attributes.Date,
				})
			)
			setEditMode(false)
		},
	})

	const [updateDailyReview] = useMutation(UPDATE_DAILY_REVIEW)


	const getRecentDates = () => {
		const dates = [];
		for (let i = 0; i < 21; i++) {
			const currentDate = sub(new Date(), { days: i });
			dates.push(format(currentDate, 'yyyy-MM-dd'));
		}
		return dates;
	};


	const handleSave = (title: string, gratitudes: string[], majorEvents: string[], details: string) => {
		if (dailyReview.id) {
			updateDailyReview({
				variables: {
					id: dailyReview.id,
					title: title,
					gratitudeList: gratitudes,
					majorEvents: majorEvents,
					details: details,
				},
			});
		} else {
			createDailyReview({
				variables: {
					title: title,
					gratitudeList: gratitudes,
					majorEvents: majorEvents,
					details: details,
					date: today,
				},
			});
		}
	}



	if (dailyReviewError) return <Typography>Error! {dailyReviewError.message}</Typography>



	return (
		<Container>
			<Grid container spacing={2}>


				{/* Left Side */}
				{dailyReviewsLoading ?
					<Grid xs={3} item></Grid>
					:
					<Grid xs={3} item>
						<div className="left-side">
							{/* Date Display */}
							<Box mt={4} mb={4}>
								<Typography variant="h5" align="center">
									{today === getCurrentLocalDate() ? "Today, " + today : today}
								</Typography>
							</Box>

							{/* Buttons */}
							<Box display="flex" justifyContent="center" mb={4}>

								<Button variant="outlined" onClick={goToToday} sx={{ mr: 2 }}>
									Today
								</Button>

							</Box>
							<Box display="flex" justifyContent="center" mb={4}>
								<Button variant="outlined" onClick={() => setEditMode(!editMode)} sx={{ mr: 2 }}>
									{editMode ? "Cancel" : "Edit"}
								</Button>
							</Box>

							{/* List of daily review titles */}
							<Box>
								<List>
									{getRecentDates().map((date) => {
										const dailyReview = dailyReviewsData.dailyReviews.data.find(
											(review: any) => review.attributes.Date === date
										);
										const dateString = formatDateWithWeekday(date);
										return (
											<ListItem
												key={date}
												button
												onClick={() => {
													console.log(date);
													setToday(date);
													setEditMode(false);
												}}
											>
												<ListItemText
													primary={
														<>
															<Typography variant="caption" component="p">
																{dateString}
															</Typography>
															<Typography component="p">
																{dailyReview
																	? dailyReview.attributes.Title || 'Untitled'
																	: <i>empty</i>
																}
															</Typography>
														</>
													}
												/>
											</ListItem>
										);
									})}
								</List>
							</Box>
						</div>
					</Grid>
				}


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
								<EditDailyReview dailyReview={dailyReview} onSave={handleSave} />
							)}
						</div>
					</Grid>
				}

			</Grid>
		</Container >
	);
};

export default DailyReviewPage;
