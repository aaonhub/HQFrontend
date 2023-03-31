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