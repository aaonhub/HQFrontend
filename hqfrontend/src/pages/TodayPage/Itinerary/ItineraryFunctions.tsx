import { EventInput } from "@fullcalendar/core";
import InboxItem from "../../../models/inboxitem";
import { getCurrentLocalDate } from "../../../components/DateFunctions";
import Habit from "../../../models/habit";


function computeEndTime(startTime: string, length: string): string {
    const startTimeParts = startTime.split(':').map(Number);
    const lengthParts = length.split(':').map(Number);

    const startDate = new Date();
    startDate.setHours(startTimeParts[0], startTimeParts[1], startTimeParts[2]);

    const endDate = new Date(startDate.getTime());
    endDate.setHours(endDate.getHours() + lengthParts[0]);
    endDate.setMinutes(endDate.getMinutes() + lengthParts[1]);

    const endHours = endDate.getHours().toString().padStart(2, '0');
    const endMinutes = endDate.getMinutes().toString().padStart(2, '0');
    const endSeconds = endDate.getSeconds().toString().padStart(2, '0');

    return `${endHours}:${endMinutes}:${endSeconds}`;
}

// Helper function to convert to-do list item to an event
export function toDoItemToEvent(item: InboxItem): EventInput | null {

    const startTime = item.startTime
    const length = item.length
    const date = item.startDate


    if (!startTime || !length) {
        return null
    }

    return {
        id: item.id + 'i',
        title: item.title,
        start: `${date}T${startTime}`,
        end: `${date}T${computeEndTime(startTime, length)}`,
        extendedProps: {
            description: item.description,
            completed: item.completed,
            project: item.project,
            dueDateTime: item.dueDateTime,
            startDate: item.startDate,
            length: length,
        },
    }
}

export function habitToEvent(item: Habit): EventInput | null {
    
    const startTime = item.timeOfDay
    const length = item.length ? item.length : '01:00'
    const date = getCurrentLocalDate()

    if (!startTime || !length) {
        return null
    }

    return {
        id: item.id + 'h',
        title: item.title,
        start: `${date}T${startTime}`,
        end: `${date}T${computeEndTime(startTime, length)}`,
        extendedProps: {
            completed: item.countToday,
            length: length,
        },
    }
}

export function getHourBeforeCurrentTime() {
    const date = new Date();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();

    // adjust hour to be one hour earlier and check it does not go beyond 00:00
    hour = hour === 0 ? 0 : hour - 1;

    // Ensuring double digit formatting
    hour = hour < 10 ? 0 + hour : hour;
    minute = minute < 10 ? 0 + minute : minute;
    second = second < 10 ? 0 + second : second;

    let hourString = hour < 10 ? "0" + hour.toString() : hour.toString();
    let minuteString = minute < 10 ? "0" + minute.toString() : minute.toString();
    let secondString = second < 10 ? "0" + second.toString() : second.toString();

    return hourString + ":" + minuteString + ":" + secondString;
}

export function formatTime(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}