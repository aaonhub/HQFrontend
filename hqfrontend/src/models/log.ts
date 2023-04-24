import { gql } from '@apollo/client';

class Log {
	constructor(
		public id: string,
		public log: string,
		public logTime: Date
	) {
		this.id = id
		this.log = log
		this.logTime = logTime
	}
}

export default Log


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