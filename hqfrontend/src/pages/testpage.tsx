import React, { useState } from 'react';

export default function Test() {
	const [startDate, setStartDate] = useState('');

	const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setStartDate(e.target.value);
	};

	return (
		<div>
			<label htmlFor="start-date">Start Date:</label>
			<input
				type="date"
				id="start-date"
				value={startDate}
				onChange={handleDateChange}
			/>
		</div>
	);
}
