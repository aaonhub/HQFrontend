import { Card, Grid, debounce, useTheme } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import bootstrap5Plugin from '@fullcalendar/bootstrap5'
import { getHourBeforeCurrentTime } from '../Functions/ItineraryFunctions'

// Mutations
import { UPDATE_TODO, UPDATE_TODO_TIME } from '../../../models/inboxitem'

// Full Calendar
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import FullCalendar from "@fullcalendar/react";
import { useMutation } from "@apollo/client";


interface CalendarCardProps {
    // events: any;
    // setEvents: any;
}


const CalendarCard = (props: CalendarCardProps) => {

    const calendarRef = useRef(null)

    const theme = useTheme();


    // Change background color of calendar
    // useEffect(() => {
    //     const todayElements = document.querySelectorAll('.fc .fc-day-today');

    //     todayElements.forEach(el => {
    //         (el as HTMLElement).style.backgroundColor = theme.palette.background.default;
    //     });

    //     return () => {
    //         todayElements.forEach(el => {
    //             (el as HTMLElement).style.backgroundColor = '';
    //         });
    //     };
    // }, [theme]);



    // const eventReceive = (info: any) => {
    //     console.log("Event Received")
    //     console.log(info)

    //     // Check if the title contains '|', if not set a default id and title
    //     if (!info.event.title.includes('|')) {
    //         info.event.setProp('id');
    //         info.event.setProp('title');
    //     } else {
    //         let [id, title] = info.event.title.split('|');

    //         // Set the id and title of the event
    //         info.event.setProp('id', id);
    //         info.event.setProp('title', title);
    //     }
    //     // Append the new event to the existing events
    //     setEvents([...events, {
    //         id: info.event.id,
    //         title: info.event.title,
    //         start: info.event.start,
    //         end: info.event.end
    //     }])
    // }


    // Calendar Stuff
    const [updateInboxItem] = useMutation(UPDATE_TODO_TIME)

    // Calendar Logic
    // const handleEventChange = debounce((changeInfo) => {

    //     // Find the index of the event that was changed
    //     const potentialItem1 = completedItems.findIndex(event => event.id === changeInfo.event.id)
    //     const potentialItem2 = uncompletedItems.findIndex(event => event.id === changeInfo.event.id)

    //     if (potentialItem1 === -1 && potentialItem2 === -1) {
    //         console.log('Event not found: ', changeInfo.event.id);
    //         return;
    //     }

    //     const confirmedItem = potentialItem1 === -1 ? uncompletedItems[potentialItem2] : completedItems[potentialItem1]

    //     // Calculate the length
    //     const differenceInMilliseconds = changeInfo.event.end - changeInfo.event.start;
    //     const differenceInMinutes = Math.floor(differenceInMilliseconds / 1000 / 60);
    //     const hours = Math.floor(differenceInMinutes / 60);
    //     const minutes = differenceInMinutes % 60;

    //     // Format the length to "hh:mm"
    //     const formattedLength = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

    //     try {
    //         updateInboxItem({
    //             variables: {
    //                 // remove the last letter of the id
    //                 ID: confirmedItem.id.slice(0, -1),
    //                 Completed: confirmedItem.completedToday,
    //                 Length: formattedLength,
    //                 StartTime: formatTime(changeInfo.event.start),
    //             }
    //         })
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }, 100);



    return (
        <Card
            sx={{ borderRadius: 2, margin: 1, padding: 1, }}
            style={{ height: '80vh', overflowY: 'auto' }}
        >
            <FullCalendar
                ref={calendarRef}
                plugins={[timeGridPlugin, interactionPlugin, bootstrap5Plugin]}
                themeSystem='standard'
                initialView="timeGridDay"
                weekends={true}
                headerToolbar={false}
                nowIndicator={true}
                scrollTime={getHourBeforeCurrentTime()}
                height="100%"
                contentHeight="100%"
                droppable={true}
                // eventReceive={eventReceive}
                // events={events}
                // eventChange={handleEventChange}
                editable={true}
                slotMaxTime="27:00:00"
            />
        </Card>
    )
}


export default CalendarCard