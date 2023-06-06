import styles from './AccountabilityPage.module.css';
import { GET_ACCOUNTABILITY_DATA } from '../../models/accountability';
import { useQuery } from '@apollo/client';
import { Box, Typography } from '@mui/material';

// User color assignment - add more colors as required
const userColors: Record<string, string> = {
	'Guy': 'red',
	'Guy1': 'blue',
	// add more colors for more codenames here...
};

// Date square
const DateSquare = ({ bars, date }: any) => {
	const totalBars = Object.keys(userColors).length;
	const barHeight = 100 / totalBars;

	return (
		<div className={styles.square}>
			<div className={styles.date}>{date}</div>
			{Object.keys(userColors).map((codename) => (
				<div
					key={codename}
					className={styles.bar}
					style={{
						backgroundColor: userColors[codename],
						width: `${bars[codename] || 0}%`,
						height: `${barHeight}%`
					}}
				/>
			))}
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
	const { data, loading, error } = useQuery(GET_ACCOUNTABILITY_DATA, {
		variables: { accountability: id },
		onError: (error) => {
			console.log(error.message);
		},
		onCompleted: (data) => {
			console.log(data);
		},
	});

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error: {JSON.stringify(error)}</p>;

	const recordsByDate: Record<string, Record<string, number>> = {};
	const codenamesById: Record<string, string> = {};

	data.monthlyCompletionPercentages.forEach((record: any) => {
		const date = new Date(record.date);
		const day = date.getDate();
		const codename = record.profile.codename;

		if (!recordsByDate[day]) recordsByDate[day] = {};
		const completionPercentage = (record.completedTasks / record.totalTasks) * 100;
		recordsByDate[day][codename] = completionPercentage;

		codenamesById[record.profile.id] = codename;
	});

	const daysInMonth = 30;  // assuming June has 30 days, adjust as needed
	const firstDayOfMonth = new Date("2023-06-01").getDay();

	const rows = [];
	for (let i = 0; i < daysInMonth; i += 7) {
		const row = Array.from(Array(7), (_, index) => {
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
							/> : <Spacer key={dateIndex} />
					))}
				</div>
			))}
		</Box>

	);
};

export default AccountabilityDisplay;
