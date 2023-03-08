import { useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { GET_HABITS } from './HabitsPage/habitsQueries';

export default function Test() {
	const { loading, error, data } = useQuery(GET_HABITS);

	const [events, setEvents] = useState([]);

	useEffect(() => {
		if (data && data.habits && data.habits.data) {
			const habitEvents = data.habits.data.map((habit: { attributes: { Title: any; LastCompleted: any; }; }) => ({
				title: habit.attributes.Title,
				start: new Date(),
				end: new Date(),
				allDay: true,
				recurring: {
					repeat: 'daily',
					startDate: habit.attributes.LastCompleted,
				},
			}));
			setEvents(habitEvents);
		}
	}, [data]);

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error :(</p>;

	return (
		<FullCalendar
			plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
			initialView="dayGridMonth"
			weekends={true}
			events={events}
			eventColor="#378006"
			editable={false}
		/>
	);
}
