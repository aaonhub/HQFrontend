import { gql } from '@apollo/client';
import Schedule from './schedule';

class Habit {
	id: string;
	title: string;
	active: boolean;
	length: string;
	schedule: Schedule;
	countToday: number;

	constructor(
		{ id, title, active, length, schedule, countToday }:
			{ id: string, title: string, active: boolean, length: string, schedule: Schedule, countToday: number }
	) {
		this.id = id;
		this.title = title;
		this.active = active;
		this.length = length;
		this.schedule = schedule;
		this.countToday = countToday;
	}
}

export default Habit


export function createEmptyHabit(): Habit {
	return {
		id: '',
		title: '',
		active: false,
		length: '',
		schedule: new Schedule({
			id: '',
			status: 'ACTIVE', // Assuming 'ACTIVE' as a default value
			visibility: 'PRIVATE', // Assuming 'PRIVATE' as a default value
			timeOfDay: null,
			startDate: '',
			endDate: null,
			timezone: '', // You might want to set a default timezone
			recurrenceRule: '',
			exclusionDates: '',
			reminderBeforeEvent: null,
			description: null,
			contentId: '',
			priority: 0, // Assuming a neutral priority
		}),
		countToday: 0,
	};
}

// Queries
export const GET_HABIT = gql`
	query($habitId: ID!){
		getHabit(id: $habitId){
			id
			title
			active
			length
			countOnDate(date: $Today)
			schedules {
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
			}
		}
	}
`

export const GET_HABITS_DUE_TODAY = gql`
	query GetHabitsDueToday($today: String!) {
		habitsDueToday(date: $today) {
			id
			title
			active
			length
			countOnDate(date: $today)
			schedules {
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
			}
		}
	}
`

export const GET_ALL_HABITS = gql`
	query myHabits {
		myHabits {
			id
			title
			active
			length
			countOnDate(date: $Today)
			schedules {
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
			}
		}
	}
`


// Mutations
export const ADD_HABIT = gql`
	mutation createHabit($Title: String!, $Active: Boolean!, $RecurrenceRule: String!) {
		createHabit(title: $Title, active: $Active, recurrenceRule: $RecurrenceRule){
			habit {
				id
				title
			}
		}
	}
`

export const DELETE_HABIT = gql`
	mutation createHabit($id: ID!) {
		deleteHabit(id: $id ) {
			habit {
				title
			}
		}
	}
`

export const UPDATE_HABIT = gql`
	mutation updateHabit($Active: Boolean!, $TimeOfDay: String, $id: ID!, $Title: String, $Frequency: String) {
		updateHabit(active: $Active, timeOfDay: $TimeOfDay, id: $id, title: $Title, frequency: $Frequency, ){
			habit{
				id
			}
		}
	}
`

export const CHECK_HABIT = gql`
	mutation updateHabitHistory($habitId: ID!, $currentDate: String!, $quantity: Int!) {
		updateHabitHistory(habitId: $habitId, currentDate: $currentDate, quantity: $quantity) {
			habit{
				id
				title
				countOnDate(date: $currentDate)
			}
		}
	}
`


// Update Later
export const DELETE_HABIT_HISTORY = gql`
	mutation DeleteHabitHistoryAndUpdateLastCompleted($id: ID!, $habitId: ID!, $lastCompleted: Date!) {
		deleteHabitHistory(id: $id) {
			data {
				id
				attributes {
					Date
					habit {
						data {
							id
							attributes {
								Title
								Frequency
							}
						}
					}
					Completed
					createdAt
				}
			}
		}
		updateHabit(id: $habitId, data: { LastCompleted: $lastCompleted }) {
			data {
				id
				attributes {
					Title
					Active
					Frequency
					LastCompleted
				}
			}
		}
	}
`