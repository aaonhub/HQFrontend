export type Status = 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
export type Visibility = 'PRIVATE' | 'PUBLIC' | 'SHARED';

class Schedule {
    status: Status;
    visibility: Visibility;
    timeOfDay: string | null; 
    startDate: string; 
    endDate: string | null; 
    timezone: string;
    recurrenceRule: string | null; 
    exclusionDates: string; 
    reminderBeforeEvent: string | null; 
    description: string | null;
    priority: number;

    constructor(
        { status, visibility, timeOfDay, startDate, endDate, timezone, recurrenceRule, exclusionDates, reminderBeforeEvent, description, priority }:
        { status: Status, visibility: Visibility, timeOfDay: string | null, startDate: string, endDate: string | null, timezone: string, recurrenceRule: string | null, exclusionDates: string, reminderBeforeEvent: string | null, description: string | null, priority: number }
    ) {
        this.status = status;
        this.visibility = visibility;
        this.timeOfDay = timeOfDay;
        this.startDate = startDate;
        this.endDate = endDate;
        this.timezone = timezone;
        this.recurrenceRule = recurrenceRule;
        this.exclusionDates = exclusionDates;
        this.reminderBeforeEvent = reminderBeforeEvent;
        this.description = description;
        this.priority = priority;
    }
}

export default Schedule;
