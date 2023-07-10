import { gql } from '@apollo/client'


interface Log {
	id: string
	logTime: Date
	text?: string
}

class Log {
	constructor({
		id,
		text,
		logTime,
	}: Log) {
		this.id = id;
		this.text = text;
		this.logTime = logTime;
	}
}

export default Log


// Queries
export const GET_TODAY_LOGS = gql`
	query TodaysLogs {
		todayLogs {
			id
			text
			logTime
		}
	}
`;

export const GET_LOGS = gql`
	query GetLogs {
		logs {
			text
			id
			logTime
		}
	}
`;

export const LAST_LOG_TIME = gql`
	query{
		lastLogTime
	}
`;


// Mutations
export const ADD_LOG = gql`
	mutation createLog(
		$text: String,
		$logTime: DateTime!
	) {
		createLog(
			text: $text,
			logTime: $logTime
		) {
				log {
				id
			}
		}
	}
`;

export const DELETE_LOG = gql`
	mutation deleteLog($id: ID!) {
	deleteLog(logId: $id) {
		success
	}
}
`;