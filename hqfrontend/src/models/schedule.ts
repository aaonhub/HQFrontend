import { gql } from '@apollo/client';

export type Status = 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
export type Visibility = 'PRIVATE' | 'PUBLIC' | 'SHARED';

class Schedule {
    status: Status | null;
    visibility: Visibility | null;
    timeOfDay: string | null;
    startDate: string;
    endDate: string | null;
    timezone: string | null;
    recurrenceRule: string | null;
    exclusionDates: string;
    reminderBeforeEvent: string | null;
    description: string | null;
    priority: number | null;

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


// Queries
export const GET_SCHEDULE = gql`
    query GetSchedule($id: ID!){
        getSchedule(id: $id){
            id
            status
            visibility
            timeOfDay
            startDate
            endDate
            timezone
            recurrenceRule
            exclusionDates
            reminderBeforeEvent
            description
            priority
            objectId
        }
    }
`;


// Mutations
export const UPDATE_SCHEDULE = gql`
    mutation UpdateSchedule(
        $id: ID!,
        $status: String
        $visibility: String
        $timeOfDay: Time
        $startDate: Date
        $endDate: Date
        $timezone: String
        $recurrenceRule: String
        $exclusionDates: String
        $reminderBeforeEvent: String
        $description: String
        $priority: Int
    ){
        UpdateSchedule(
            id: $id,
            status: $status
            visibility: $visibility
            timeOfDay: $timeOfDay
            startDate: $startDate
            endDate: $endDate
            timezone: $timezone
            recurrenceRule: $recurrenceRule
            exclusionDates: $exclusionDates
            reminderBeforeEvent: $reminderBeforeEvent
            description: $description
            priority: $priority
        ){
            schedule{
                id
                status
                visibility
                timeOfDay
                startDate
                endDate
                timezone
                recurrenceRule
                exclusionDates
                reminderBeforeEvent
                description
                priority
                objectId
            }
        }
    }
`;