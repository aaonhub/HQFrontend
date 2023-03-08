import React from "react";
import { useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import { GET_HABITS } from "../HabitsPage/habitsQueries";

const MainView: React.FC = () => {
	const [events, setEvents] = useState([]);
	const { loading, error, data } = useQuery(GET_HABITS);

	const now = new Date().toLocaleTimeString('en-US', {
		hour12: false,
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
	});

	useEffect(() => {
		if (data && data.habits && data.habits.data) {
			const habitEvents = data.habits.data
				.map((habit: { attributes: { Title: any; LastCompleted: any; order: number } }) => ({
					title: habit.attributes.Title,
					start: new Date(),
					end: new Date(),
					allDay: true,
					recurring: {
						repeat: 'daily',
						startDate: habit.attributes.LastCompleted,
					},
					order: habit.attributes.order, // add the order attribute to each event
				}))
				.sort((a: { order: number; }, b: { order: number; }) => a.order - b.order); // sort the events by order attribute

			console.log('Habit List:', data.habits.data); // print the habit list to the console
			setEvents(habitEvents);
			console.log('Events:', habitEvents); // print the events to the console
		}
	}, [data]);



	return (
		<div style={{ display: 'flex' }}>
			{/* day view calendar */}
			<div style={{ flex: '1', paddingRight: '16px' }}>
				<FullCalendar
					plugins={[timeGridPlugin]}
					initialView="timeGridDay"
					weekends={true}
					events={events}
					nowIndicator={true}
					scrollTime={now}
					// contentHeight="1200px"
					height="90vh"
				/>
			</div>

			{/* list view calendar */}
			<div style={{ flex: '1' }}>
				<FullCalendar
					plugins={[listPlugin]}
					initialView="listDay"
					headerToolbar={false}
					weekends={true}
					events={events}
					height="90vh"
				/>
			</div>
		</div>
	);
};

export default MainView;
