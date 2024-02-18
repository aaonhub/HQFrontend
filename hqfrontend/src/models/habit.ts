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


// Queries
export const GET_HABIT = gql`
	query($habitId: ID!){
		getHabit(id: $habitId){
			id
			title
			active
			length
			countToday
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
	query GetHabitsDueToday($today: Date!) {
		habitsDueToday(date: $today) {
			id
			title
			active
			length
			countToday
			schedule{
				id
				frequency
				daysOfTheWeek
				daysOfTheMonth
				daysOfTheYear
				startDate
				endDate
				timeOfDay
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
			countToday
			length
			countToday
			schedule{
				id
				timeOfDay
				frequency
				startDate
				endDate
			}
		}
	}
`


// Mutations
export const ADD_HABIT = gql`
	mutation createHabit($Title: String!, $Active: Boolean!, $Frequency: String!, $StartDate: String!) {
		createHabit(title: $Title, active: $Active, frequency: $Frequency, startDate: $StartDate ) {
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
	mutation updateHabitHistory($habitId: ID!, $currentDate: Date!, $quantity: Int!) {
		updateHabitHistory(habitId: $habitId, currentDate: $currentDate, quantity: $quantity) {
			habit{
				id
				title
				countToday
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