import styles from './AccountabilityPage.module.css';
import { useQuery, useMutation } from '@apollo/client';
import { Box, Button, Typography, Tooltip } from '@mui/material';

// Queries and Mutations
import { GET_ACCOUNTABILITY_DATA } from '../../models/accountability';
import { ACCEPT_ACCOUNTABILITY_INVITE } from "../../models/accountability"


// User color assignment - add more colors as required
const userColors: Record<string, string> = {
	'Guy': 'red',
	'dirtylitter': 'pink',
	'Rosie': 'yellow',
	// add more colors for more codenames here...
};

// Date square
const DateSquare = ({ bars, date, records }: any) => {
	const totalBars = Object.keys(userColors).length;
	const barHeight = 100 / totalBars;

	return (
		<div className={styles.square}>
			<div className={styles.date}>{date}</div>
			{Object.keys(userColors).map((codename) => {
				const percentage = bars[codename] || 0;
				const record = records.find((r: any) => r.profile.codename === codename);
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

	// Accountability data query
	const { data, loading, error } = useQuery(GET_ACCOUNTABILITY_DATA, {
		variables: { accountability: id },
		onError: (error) => {
			console.log(error.message);
		},
		onCompleted: (data) => {
			console.log(data);
		},
	});

	const [acceptAccountabilityInvite] = useMutation(ACCEPT_ACCOUNTABILITY_INVITE, {
		variables: {
			id: id,
		},
		onCompleted: () => {
			window.location.reload()
		}
	})

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
		console.log(day)

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
		// center the box
		<Box>
			<Typography
				variant="h4"
				gutterBottom
				style={{
					textAlign: "center",
					paddingTop: "20px",
				}}
			>Accountability Page</Typography>

			<div className={styles.legend}>
				{Object.keys(codenamesById).map((id) => (
					<div key={id} className={styles.legendItem}>
						<div className={styles.legendColor} style={{ backgroundColor: userColors[codenamesById[id]] }} />
						<div className={styles.legendLabel}>{codenamesById[id]}</div>
					</div>
				))}
			</div>
			{rows.map((row, rowIndex) => (
				<div key={rowIndex} style={{ display: "flex" }}>
					{row.map((date, dateIndex) => (
						date ?
							<DateSquare
								key={dateIndex}
								bars={recordsByDate[date] || {}}
								date={date}
								records={data.monthlyCompletionPercentages}
							/> : <Spacer key={dateIndex} />
					))}
				</div>
			))}
		</Box>

	);
};

export default AccountabilityDisplay;
