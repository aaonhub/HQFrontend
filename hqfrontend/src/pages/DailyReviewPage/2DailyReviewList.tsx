import { Badge, Box, Button, Grid, List, ListItem, ListItemText, Typography } from '@mui/material'
import { formatDateWithWeekday, currentYYYYMMDD } from '../../components/DateFunctions'
import { format, sub } from 'date-fns';
import { useGlobalContext } from '../../pages/App/GlobalContextProvider';


interface DailyReviewListProps {
	today: string;
	setToday: React.Dispatch<React.SetStateAction<string>>;
	editMode: boolean;
	setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
	data: any;
	loading: any;
}

const DailyReviewList: React.FC<DailyReviewListProps> = ({ today, setToday, editMode, setEditMode, data, loading }) => {
	const { dailyReviewBadges } = useGlobalContext();


	const goToToday = () => {
		setToday(currentYYYYMMDD())
	};

	const getRecentDates = () => {
		const dates = [];
		for (let i = 0; i < 21; i++) {
			const currentDate = sub(new Date(), { days: i });
			dates.push(format(currentDate, 'yyyy-MM-dd'));
		}
		return dates;
	};



	if (loading) return <p>Loading...</p>;


	return (
		<Grid xs={3} item>
			<div className="left-side">
				{/* Date Display */}
				<Box mt={4} mb={4}>
					<Typography variant="h5" align="center">
						{today === currentYYYYMMDD() ? "Today, " + today : today}
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
							const dailyReview = data.dailyReviews.find((review: any) => review.date === date);
							const dateString = formatDateWithWeekday(date);
							const isCurrentDay = date === currentYYYYMMDD();
							const showBadge = isCurrentDay && dailyReviewBadges[1] === 1;

							return (
								<Box key={date} sx={{ width: '100%' }}>
									<ListItem
										key={date}
										button
										onClick={() => {
											setToday(date);
											if (dailyReview) {
												setEditMode(false);
											} else {
												setEditMode(true);
											}
										}}
										sx={{
											position: 'relative',
											width: '100%',
											display: 'flex',
											justifyContent: 'space-between',
											alignItems: 'center',
											paddingRight: '48px', // Adjust the padding to your needs
										}}
									>
										<ListItemText
											primary={
												<>
													<Typography variant="caption" component="p">
														{dateString}
													</Typography>
													<Typography component="p">
														{dailyReview ? dailyReview.title || 'Untitled' : <i>-----</i>}
													</Typography>
												</>
											}
										/>
										<Badge
											color="error"
											badgeContent={showBadge ? 1 : 0}
											variant="dot"
											sx={{ display: showBadge ? 'inline-flex' : 'none' }}
										/>
									</ListItem>
								</Box>

							);
						})}
					</List>
				</Box>
			</div>
		</Grid >
	);
}

export default DailyReviewList;