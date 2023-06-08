import { gql } from '@apollo/client';

export type HabitFrequency = {
	startDate: Date
	endDate: Date | null
	timeOfDay: string
	repetitionFrequency: number
	daysOfTheWeek: Array<string>
	daysOfTheMonth: Array<number>
	dayOfTheYear: number
}

export type Frequency = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY' | 'RITUALONLY'

class Habit {
	constructor(
		public id: string,
		public title: string,
		public active: boolean,
		public frequency: Frequency | '',
		public lastCompleted: Date,
		public order: number,
		public daysOfTheWeek: Array<string>,
		public daysOfTheMonth: Array<number>,
		public dayOfTheYear: number,
		public startDate: Date,
		public endDate: Date | null,
		public timeOfDay: string,
		public completedToday: boolean
	) {
		this.id = id;
		this.title = title;
		this.active = active;
		this.frequency = frequency || '';
		this.lastCompleted = lastCompleted;
		this.order = order || 0;
		this.daysOfTheWeek = daysOfTheWeek || [];
		this.daysOfTheMonth = daysOfTheMonth || [];
		this.dayOfTheYear = dayOfTheYear || 0;
		this.startDate = startDate;
		this.endDate = endDate;
		this.timeOfDay = timeOfDay || '';
		this.completedToday = completedToday;
	}
}

export default Habit


// Queries
// Updated to django
export const GET_HABITS_DUE_TODAY = gql`
	query GetHabitsDueToday($today: Date!) {
		habitsDueToday(date: $today) {
			id
			title
			active
			frequency
			lastCompleted
			order
			daysOfTheWeek
			daysOfTheMonth
			dayOfTheYear
			startDate
			endDate
			timeOfDay
			completedToday
		}
	}
`

export const GET_ALL_HABITS = gql`
	query myHabits {
		myHabits {
			id
			title
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
	mutation createHabitHistoryAndUpdateLastCompleted($habitId: ID!, $currentDate: Date!) {
		createHabitHistoryAndUpdateLastCompleted( habitId: $habitId, currentDate: $currentDate) {
			habitHistory {
				id
			}
		}
	}
`

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