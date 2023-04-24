import { gql } from '@apollo/client';

export type Type = 'text' | 'habit' | 'todoitem';

class Log {
	constructor(
		public id: string,
		public log: string,
		public logTime: Date,
		public type: Type
	) {
		this.id = id
		this.log = log
		this.logTime = logTime
		this.type = type
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
					Log
					LogTime
					Type
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
					Log
					LogTime
					Type
				}
			}
		}
	}
`;


// Mutations
export const ADD_LOG = gql`
	mutation createLog($Log: String!, $LogTime: DateTime!) {
		createLog(data: { Log: $Log, LogTime: $LogTime }) {
			data {
				id
				attributes {
					Log
					LogTime
					Type
				}
			}
		}
	}
`;
