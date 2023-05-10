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
// Updated to django
export const GET_TODAY_LOGS = gql`
	query TodaysLogs {
		todayLogs {
			id
			text
			logTime
			type
			completeHabit {
				id
				title
			}
			completeTodoitem {
				id
				title
			}
		}
	}
`;

// Updated to django
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
// Updated to django
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
