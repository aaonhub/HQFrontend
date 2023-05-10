import { gql } from '@apollo/client'


export type Type = 'TEXT' | 'COMPLETE_HABIT' | 'COMPLETE_TODOITEM'

interface LogHabit {
	id: string
	title: string
}

interface LogToDoItem {
	id: string
	title: string
}

interface Log {
	id: string
	logTime: Date
	type?: Type
	text?: string
	habit?: LogHabit
	toDoItem?: LogToDoItem
}

class Log {
	constructor({
		id,
		text,
		logTime,
		type,
		habit,
		toDoItem,
	}: Log) {
		this.id = id;
		this.text = text;
		this.logTime = logTime;
		this.type = type;
		this.habit = habit;
		this.toDoItem = toDoItem;
	}
}

export default Log


// Queries
export const GET_TODAY_LOGS = gql`
	query TodaysLogs($Start: DateTime!, $End: DateTime!) {
		logs(filters: {LogTime: {gte: $Start, lt: $End}}) {
			data {
				id
				attributes {
					Text
					LogTime
					Type
					to_do_item {
						data {
							id
							attributes {
								Title
							}
						}
					}
					habit {
						data {
							id
							attributes {
								Title
							}
						}
					}
				}
			}
		}
	}
`;

export const GET_LOGS = gql`
	query GetLogs {
		logs {
			text
			id
			completeHabit {
				id
				title
			}
			completeTodoitem {
				id
				title
			}
			logTime
			type
		}
	}
`;


// Mutations
export const ADD_LOG = gql`
	mutation createLog(
		$text: String, 
		$todoItemId: ID,
		$habitId: ID,
		$logTime: DateTime!
	) {
		createLog(
			text: $text,
			habitId: $habitId,
			todoItemId: $todoItemId,
			logTime: $logTime
		) {
			log {
				id
			}
		}
	}
`;
