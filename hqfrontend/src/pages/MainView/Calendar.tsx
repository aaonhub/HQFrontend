import React from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Card, CardContent } from '@mui/material';

const Calendar = () => {
	const now = new Date().toLocaleTimeString('en-US', {
		hour12: false,
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
	});

	return (
		<Card sx={{
			borderRadius: 2,
			boxShadow: 2,
			height: '100%',
			overflow: 'hidden',
			marginRight: 2,
		}}>
			<CardContent sx={{ height: '100%', padding: 1 }}>
				<FullCalendar
					plugins={[timeGridPlugin]}
					initialView="timeGridDay"
					weekends={true}
					headerToolbar={false}
					nowIndicator={true}
					scrollTime={now}
					height="100%"
					contentHeight="100%"
				/>
			</CardContent>
		</Card>
	);
};

export default Calendar;
