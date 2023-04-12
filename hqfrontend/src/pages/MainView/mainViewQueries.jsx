import { gql } from '@apollo/client';

// Get all to do list items for today
export const GET_TODAY_LIST_ITEMS = gql`
	query GetTodaysToDoList($Today: Date!) {
		toDoItems(filters: {StartDate: {eq: $Today}}) {
			data {
				id
				attributes {
					Title
					Completed
					StartDate
					StartTime
				}
			}
		}
	}
`;

export const GET_TODAY_LOGS = gql`
	query TodaysLogs($Start: DateTime!, $End: DateTime!) {
		logs(filters: {LogTime: {gte: $Start, lt: $End}}) {
			data {
				id
				attributes {
					Log
					LogTime
				}
		}
	}
}
`;


export const GET_HABITS_DUE_TODAY = gql`
	query GetHabitsDueToday($today: Date!, $daily: StringFilterInput!, $weekly: StringFilterInput!, $monthly: StringFilterInput!, $dayOfWeek: String!, $dayOfMonth: Int!) {
		habits(filters: {
			or: [
				{ Frequency: $daily },
				{ Frequency: $weekly, HabitFrequency: { DaysOfTheWeek: { eq: $dayOfWeek } } },
				{ Frequency: $monthly, HabitFrequency: { DaysOfTheMonth: { eq: $dayOfMonth } } }
			]
		}) {
			data {
				id
				attributes{
					Title
					HabitFrequency {
						TimeOfDay
					}
					habit_histories(filters: {Date: {eq: $today}}) {
						data {
							attributes {
								Date
								Completed
							}
						}
					}
				}
			}
		}
	}
`;

export const CHECK_HABIT = gql`
	mutation CheckHabit($habitId: ID!, $date: Date!) {
		createHabitHistory(data: {
			habit: $habitId,
			Date: $date,
			Completed: true
		}) {
			data {
				id
			}
		}
	}
`;


export const CHECK_TODO = gql`
	mutation CheckToDoItem($id: ID!) {
		updateToDoItem(input: {
			id: $id,
			Completed: true
		}) {
			id
		}
	}
`;