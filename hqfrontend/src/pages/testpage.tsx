import React, { useState } from 'react';
import {
	dateToYYYYMMDD,
	yyyymmddToDate,
	dateTo24hTime,
} from '../components/DateFunctions';

const TestPage = () => {
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

			<br />
			<br />

			<div>
				<p>
					Date object: <code>{inputDate.toString()}</code>
				</p>

				<hr />

				<p>
					24-hour time: <code>{dateTo24hTime(inputDate)}</code>
				</p>


				<hr />

				<p>
					YYYY-MM-DD: <code>{dateToYYYYMMDD(inputDate)}</code>
				</p>
				<p>
					Date object: <code>{yyyymmddToDate(dateToYYYYMMDD(inputDate)).toString()}</code>
				</p>
			</div>
		</div>
	);
};

export default TestPage;
