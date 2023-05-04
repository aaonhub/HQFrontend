import { gql } from '@apollo/client'


export type Type = 'text' | 'complete_habit' | 'complete_todoitem'

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
	query {
		logs(pagination: { page: 1, pageSize: 10 }, sort: "LogTime:desc") {
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


// Mutations
export const ADD_TEXT_LOG = gql`
	mutation createTextLog(
		$Text: String!, 
		$LogTime: DateTime!
	) {
		createLog(data: { 
			Text: $Text, 
			LogTime: $LogTime, 
			Type: text 
		}) {
			data {
				id
				attributes {
					Text
					LogTime
					Type
				}
			}
		}
	}
`;

export const ADD_HABIT_LOG = gql`
	mutation createHabitLog($LogTime: DateTime!, $Habit: ID!) {
		createLog(data: { LogTime: $LogTime, habit: $Habit, Type: complete_habit }) {
			data {
				id
				attributes {
					habit {
						data {
							id
							attributes {
								Title
							}
						}
					}
					LogTime
					Type
				}
			}
		}
	}
`;

export const ADD_TODO_LOG = gql`
	mutation createTodoLog(
		$LogTime: DateTime!, 
		$ToDoItem: ID!
	) {
		createLog(data: { 
			LogTime: $LogTime, 
			to_do_item: $ToDoItem, 
			Type: complete_todoitem 
		}) {
			data {
				id
				attributes {
					LogTime
					to_do_item {
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