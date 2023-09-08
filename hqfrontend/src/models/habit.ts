import { gql } from '@apollo/client';

export type Frequency = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY' | 'RITUALONLY'

class Habit {
	constructor(
		public id: string,
		public title: string,
		public active: boolean,
		public frequency: Frequency | '',
		public daysOfTheWeek: Array<string>,
		public daysOfTheMonth: Array<number>,
		public dayOfTheYear: Array<number>,
		public startDate: string,
		public endDate: Date | null,
		public timeOfDay: string,
		public length: string,
		public countToday: number
	) {
		this.id = id;
		this.title = title;
		this.active = active;
		this.frequency = frequency || '';
		this.daysOfTheWeek = daysOfTheWeek || [];
		this.daysOfTheMonth = daysOfTheMonth || [];
		this.dayOfTheYear = dayOfTheYear || 0;
		this.startDate = startDate;
		this.endDate = endDate;
		this.timeOfDay = timeOfDay || '';
		this.length = length;
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
			schedule{
				id
				startDate
				endDate
				timeOfDay
				daysOfTheWeek
				daysOfTheMonth
				daysOfTheYear
				frequency
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