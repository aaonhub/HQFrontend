import styles from './AccountabilityPage.module.css';
import { useQuery, useMutation } from '@apollo/client';
import { Box, Button, Typography, Tooltip, Grid, Checkbox, Card, CardContent } from '@mui/material';
import { useGlobalContext } from '../App/GlobalContextProvider';

// Queries and Mutations
import { GET_ACCOUNTABILITY, GET_ACCOUNTABILITY_DATA } from '../../models/accountability';
import { ACCEPT_ACCOUNTABILITY_INVITE } from "../../models/accountability"
import { useState } from 'react';
import UpdateAccountabilityDialog from './UpdateAccountabilityDialog';
import { currentYYYYMMDD } from '../../components/DateFunctions';


// User color assignment - add more colors as required
const userColors: Record<string, string> = {
	'Guy': 'red',
	'dirtylitter': 'pink',
	'Rosie': 'yellow',
	// add more colors for more codenames here...
};


// Convert to 2-digit format
function formatDay(day: number) {
	return (day < 10 ? '0' : '') + day;
}


// Date square
const DateSquare = ({ bars, date, records, currentMonth, currentYear }: any) => {
	const totalBars = Object.keys(userColors).length;
	const barHeight = 100 / totalBars;

	// Format date to match the records date format
	const formattedDate = `${currentYear}-${formatDay(currentMonth)}-${formatDay(date)}`;

	return (
		<div className={styles.square}>
			<div className={styles.date}>{date}</div>
			{Object.keys(userColors).map((codename) => {
				const percentage = bars[codename] || 0;
				const record = records.find((r: any) => r.date === formattedDate && r.profile.codename === codename);
				const fraction = record ? `${record.completedTasks}/${record.totalTasks}` : '0/0';

				return (
					<Tooltip
						key={codename}
						title={
							<>
								<Typography color="inherit">{`${codename}: ${percentage.toFixed(1)}%`}</Typography>
								<Typography color="inherit">{`(${fraction})`}</Typography>
							</>
						}
					>
						<div
							className={styles.bar}
							style={{
								backgroundColor: userColors[codename],
								width: `${percentage}%`,
								height: `${barHeight}%`
							}}
						/>
					</Tooltip>
				);
			})}
		</div>
	);
};


// Spacer Square
const Spacer = () => (
	<div
		className={styles.square}
		style={{ backgroundColor: "grey" }}
	/>
);





const AccountabilityDisplay = ({ id }: { id: string }) => {
	const { globalProfile } = useGlobalContext();
	const [showUpdateAccountabilityDialog, setShowUpdateAccountabilityDialog] = useState(false);


	// Accountability data query
	const { data, loading, error } = useQuery(GET_ACCOUNTABILITY_DATA, {
		variables: { accountability: id },
		onError: (error) => {
			console.log(error.message);
		},
		onCompleted: (data) => {
			console.log(data);
		}
	});

	// Squad Query
	const { data: accountabilityData } = useQuery(GET_ACCOUNTABILITY, {
		variables: { id: id },
		onError: (error) => {
			console.log(error.message);
		},
	});

	// ACCEPT_ACCOUNTABILITY_INVITE
	const [acceptAccountabilityInvite] = useMutation(ACCEPT_ACCOUNTABILITY_INVITE, {
		variables: {
			id: id,
		},
		onCompleted: () => {
			window.location.reload()
		}
	})

	const today = currentYYYYMMDD()
	const todayTasksArray = data?.monthlyCompletionPercentages.filter((record: { date: any; }) => record.date === today) || [];



	if (loading) return <p>Loading...</p>;
	if (error) return (
		<div>
			<p>Error: {error.message}</p>
			<Button onClick={() => acceptAccountabilityInvite()} color="primary" variant="contained">
				Accept Invite
			</Button>
		</div>
	);

	const recordsByDate: Record<string, Record<string, number>> = {};
	const codenamesById: Record<string, string> = {};

	data.monthlyCompletionPercentages.forEach((record: any) => {
		const date = record.date;
		const day1 = date.slice(-2);
		const day = day1[0] === '0' ? day1[1] : day1;
		const codename = record.profile.codename;

		if (!recordsByDate[day]) recordsByDate[day] = {};
		const completionPercentage = (record.completedTasks / record.totalTasks) * 100;
		recordsByDate[day][codename] = completionPercentage;

		codenamesById[record.profile.id] = codename;
	});

	const currentDate = new Date();
	const currentMonth = currentDate.getMonth() + 1;
	const currentYear = currentDate.getFullYear();
	const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
	const firstDayOfMonth = new Date(currentYear, currentMonth - 1, 1).getDay();

	const rows = [];
	let offset = firstDayOfMonth;

	for (let i = 0; i < daysInMonth + offset; i += 7) {
		const row = Array.from(Array(7), (_, index) => {
			if (offset > 0) {
				offset--;
				return null;
			}
			const day = i + index + 1 - firstDayOfMonth;
			return (day >= 1 && day <= daysInMonth) ? day : null;
		});
		rows.push(row);
	}


	return (
		<Box padding="20px">

			{/* Title */}
			<Typography
				variant="h4"
				gutterBottom
				style={{
					textAlign: "center",
					paddingTop: "20px",
				}}
			>{accountabilityData?.getAccountability.name}</Typography>

			{/* Organizer */}
			<Grid container spacing={3}>
				<Grid item xs={6} sm={6}>
					<Typography
						variant="h5"
						gutterBottom
						style={{
							textAlign: "center",
							paddingTop: "20px",
						}}
					>Organizer: {accountabilityData?.getAccountability.organizer.codename}</Typography>
				</Grid>


				{/* Edit Button */}
				<Grid item xs={6} sm={6}>
					{
						globalProfile?.codename === accountabilityData?.getAccountability.organizer.codename ?
							<Button
								onClick={() => setShowUpdateAccountabilityDialog(true)}
								color="primary"
								variant="contained"
								style={{ margin: "20px" }}
							>
								Edit
							</Button>
							: null
					}
				</Grid>


			</Grid>


			{/* Legend */}
			<div className={styles.legend}>
				{Object.keys(codenamesById).map((id) => (
					<div key={id} className={styles.legendItem}>
						<div className={styles.legendColor} style={{ backgroundColor: userColors[codenamesById[id]] }} />
						<div className={styles.legendLabel}>{codenamesById[id]}</div>
					</div>
				))}
			</div>


			{/* Calendar */}
			{rows.map((row, rowIndex) => (
				<div key={rowIndex} style={{ display: "flex" }}>
					{row.map((date, dateIndex) => (
						date ?
							<DateSquare
								key={dateIndex}
								bars={recordsByDate[date] || {}}
								date={date}
								records={data.monthlyCompletionPercentages}
								currentMonth={currentMonth}
								currentYear={currentYear}
							/> : <Spacer key={dateIndex} />
					))}
				</div>
			))}


			{/* To Do Lists */}
			{/* If type basic shared */}
			{accountabilityData?.getAccountability.type === "Basic Shared" && todayTasksArray.length > 0 && (
				<div>
					<Typography variant="h6" gutterBottom style={{ textAlign: "center", paddingTop: "20px" }}>
						Today's Tasks
					</Typography>

					<Grid container spacing={3}>
						{todayTasksArray.map((todayTasks: any) => {
							const parsedTasks = JSON.parse(todayTasks.tasksList);
							const sortedTasks = parsedTasks.sort((a: any, b: any) => (a.checked === b.checked ? 0 : a.checked ? 1 : -1));

							return (
								<Grid item xs={12} sm={6} key={todayTasks.profile.id}>
									<Card>
										<CardContent>
											<Typography variant="subtitle1" style={{ paddingTop: "10px", fontWeight: "bold" }}>
												{todayTasks.profile.codename}
											</Typography>
											<ul>
												{sortedTasks.map((task: any, index: number) => (
													<li key={index}>
														<Checkbox
															checked={task.checked}
															inputProps={{ 'aria-label': 'controlled-checkbox' }}
															style={{ marginRight: "8px" }}
															disabled
														/>
														{task.title}
													</li>
												))}
											</ul>
										</CardContent>
									</Card>
								</Grid>
							);
						})}
					</Grid>

				</div>
			)}

			{/* Update Accountability Dialog */}
			{showUpdateAccountabilityDialog && (
				<UpdateAccountabilityDialog
					onClose={() => setShowUpdateAccountabilityDialog(false)}
					accountabilityId={id}
				/>
			)}


		</Box>

	);
};

export default AccountabilityDisplay;
