import styles from './AccountabilityPage.module.css';

// Sample data
const users = [
	{
		name: "User 1",
		history: {
			"2023": "**50505050505050505050505050505050505050505050505050505050**",
		},
	},
	{
		name: "User 2",
		history: {
			"2023": "**50505050505050505050505050505050505050505050505050505050**",
		},
	},
];




// Parser
function parseHistory(historyString: any) {
	let historyArray = [];

	for (let i = 0; i < historyString.length; i += 2) {
		let slice = historyString.slice(i, i + 2);

		if (slice === '**') {
			historyArray.push(100);
		} else {
			historyArray.push(parseInt(slice, 10));
		}
	}

	return historyArray;
}

// Encoder
function encodeHistory(historyArray: any) {
	let historyString = '';

	for (let i = 0; i < historyArray.length; i++) {
		let value = historyArray[i];

		if (value === 100) {
			historyString += '**';
		} else if (value < 10) {
			historyString += '0' + value.toString();
		} else {
			historyString += value.toString();
		}
	}

	return historyString;
}

// Days in month
function getDaysInMonth(dateString: any) {
	const [year, month] = dateString.split('-');
	const lastDayOfMonth = new Date(parseInt(year), parseInt(month), 0).getDate();
	return lastDayOfMonth;
}


// Date square
const DateSquare = ({ bars, date }: any) => {
	const totalBars = bars.length;
	const barHeight = 100 / totalBars;

	return (
		<div className={styles.square}>
			<div className={styles.date}>{date}</div>
			{bars.map((bar: any, index: any) => (
				<div
					key={index}
					className={styles.bar}
					style={{ width: `${bar}%`, height: `${barHeight}%` }}
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
	>

	</div>
);




const AccountabilityDisplay = (id: any) => {
	const bars = [30, 60];

	const history1 = parseHistory(users[0].history["2023"]);
	const history2 = parseHistory(users[1].history["2023"]);

	// create a new array with the number of days in the month
	const daysInMonth = getDaysInMonth("2023-06");

	// Function to get day of week for first day in month
	function getFirstDayOfMonth(dateString: any) {
		const [year, month] = dateString.split('-');
		const firstDayOfMonth = new Date(year, parseInt(month) - 1, 1).getDay();
		return firstDayOfMonth;
	}


	// Create nested arrays for rows of 7
	const firstDayOfMonth = getFirstDayOfMonth("2023-06");

	// Create nested arrays for rows of 7
	const rows = [];
	for (let i = 0; i < daysInMonth; i += 7) {
		const row = Array.from(Array(7), (_, index) => {
			let date = i + index + 1 - firstDayOfMonth;
			return (date >= 0 && date <= daysInMonth) ? date : null;
		});
		if (i === 0) {
			for (let j = 0; j < firstDayOfMonth; j++) {
				row[j] = 0;
			}
		}
		rows.push(row);
	}



	return (
		<div>
			<h1>Accountability Page</h1>

			{/* <DateSquare bars={bars} date={1} /> */}

			{rows.map((row, rowIndex) => (
				<div key={rowIndex} style={{ display: "flex" }}>
					{row.map((date, dateIndex) => (
						date && date > 0 ?
							<DateSquare
								key={dateIndex}
								bars={[history1[date - 1], history2[date - 1]]}
								date={date}
							/> : <Spacer key={dateIndex} />
					))}
				</div>
			))}



		</div>
	);
};

export default AccountabilityDisplay;
