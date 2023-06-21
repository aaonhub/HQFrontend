import React, { useEffect, useState, useRef } from 'react'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin, { Draggable } from '@fullcalendar/interaction'
import { Card, CardContent } from '@mui/material'
import { EventInput } from '@fullcalendar/core'

const Calendar = () => {
	const now = new Date().toLocaleTimeString('en-US', {
		hour12: false,
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
	})

	const [events, setEvents] = useState<EventInput[]>([
		{
			id: '1',
			title: 'my event',
		},
	])
	const calendarRef = useRef(null)

	useEffect(() => {
		let draggableEl = document.getElementById('external-events')

		if (draggableEl) {
			new Draggable(draggableEl, {
				itemSelector: '.event-class',
				eventData: function (eventEl) {
					let event = JSON.parse(eventEl.getAttribute('data-event') ?? '{}')
					return {
						title: event?.title,
						duration: event?.duration,
					}
				},
			})
		}
	}, [])

	const handleEventChange = (changeInfo: any) => {
		console.log(changeInfo.event.start)
		// Find the index of the event that was changed
		const index = events.findIndex(event => event.id === changeInfo.event.id)

		// Create a new array of events
		const newEvents = [...events]

		// Update the start and end times of the changed event
		newEvents[index].start = changeInfo.event.start
		newEvents[index].end = changeInfo.event.end

		// Update the state
		setEvents(newEvents)
	}

	const eventReceive = (info: any) => {
		// Handle the actual event creation
		setEvents([...events, {
			id: info.event.id,
			title: info.event.title,
			start: info.event.start,
			end: info.event.end
		}])
	}

	return (
		<Card sx={{
			borderRadius: 2,
			boxShadow: 2,
			height: '100%',
			overflow: 'hidden',
			marginRight: 2,
		}}>
			<CardContent sx={{ height: '100%', padding: 1 }}>
				<div id='external-events'>
					{events.map((event) => (
						<div
							key={event.id}
							className="event-class"
							data-event={JSON.stringify({
								title: event.title,
								duration: '02:00'
							})}
						>
							{event.title}
						</div>
					))}
				</div>
				<FullCalendar
					ref={calendarRef}
					plugins={[timeGridPlugin, interactionPlugin]}
					initialView="timeGridDay"
					weekends={true}
					headerToolbar={false}
					nowIndicator={true}
					scrollTime={now}
					height="100%"
					contentHeight="100%"
					droppable={true}
					eventReceive={eventReceive}
					events={events}
					eventChange={handleEventChange}
					editable={true}
				/>
			</CardContent>
		</Card>
	)
}

export default Calendar
