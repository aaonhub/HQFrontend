import React, { useState } from 'react'
import { Box, Grid, Paper, Typography } from "@mui/material"

import {
	dateToYYYYMMDD,
	yyyymmddToDate,
	dateTo24hTime,
} from '../../components/DateFunctions'


const DemoPage = () => {
	const [inputDate, setInputDate] = useState(new Date());

	const handleDateTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newDate = ISOtoDate(e.target.value);
		setInputDate(newDate);
	};

	const ISOtoDate = (isoString: string) => {
		const fakeUtcTime = new Date(`${isoString}Z`);
		return new Date(fakeUtcTime.getTime() + fakeUtcTime.getTimezoneOffset() * 60000);
	}

	const dateToISO = (date: Date) => {
		const d = new Date();
		const dateTimeLocalValue = (new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString()).slice(0, -1);
		return dateTimeLocalValue
	}

	return (
		<div>
			<h1>Date Conversion Demo</h1>

			<div>
				<label>
					Select a date and time:
					<input
						type="datetime-local"
						value={dateToISO(inputDate)}
						onChange={handleDateTimeChange}
					/>
				</label>
			</div>

			<Grid container spacing={2}>
				<Grid item xs={12}>
					<Paper>
						<Box sx={{ p: '1rem' }}>
							<Typography variant="h6">Date</Typography>
							<Typography><code>{inputDate.toString()}</code></Typography>
						</Box>
					</Paper>
				</Grid>
				<Grid item xs={12}>
					<Paper>
						<Box sx={{ p: '1rem' }}>
							<Typography variant="h6">Date to 24-hour time</Typography>
							<Typography>{dateTo24hTime(inputDate)}</Typography>
						</Box>
					</Paper>
				</Grid>
				<Grid item xs={12}>
					<Paper>
						<Box sx={{ p: '1rem' }}>
							<Typography variant="h6">Date to YYYY-MM-DD</Typography>
							<Typography>
								{dateToYYYYMMDD(inputDate)}
							</Typography>
							<Typography>
								Back to Date: <code>{yyyymmddToDate(dateToYYYYMMDD(inputDate)).toString()}</code>
							</Typography>
						</Box>
					</Paper>
				</Grid>
			</Grid>

		</div>
	);
};

export default DemoPage;
