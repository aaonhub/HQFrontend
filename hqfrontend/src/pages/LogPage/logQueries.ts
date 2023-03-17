import { gql } from '@apollo/client';

// Queries
export const GET_LOGS = gql`
	query {
		logs(pagination: { page: 1, pageSize: 10 }, sort: "LogTime:desc") {
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




// Mutations
export const ADD_LOG = gql`
	mutation createLog($Log: String!, $LogTime: DateTime!) {
		createLog(data: { Log: $Log, LogTime: $LogTime }) {
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
