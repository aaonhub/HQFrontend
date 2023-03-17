import { gql } from '@apollo/client';

// Get all habits for today and also if they are completed
export const GET_HABITS = gql`
query habits($Today: Date) {
	habits {
		data {
			id
			attributes {
				Title
				Active
				Frequency
				LastCompleted
				Order
				habit_histories(filters: {Date: {eq: $Today}}) {
					data {
						id
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



// Mutations
export const ADD_HABIT = gql`
mutation createHabit($Title: String!, $Active: Boolean!, $Frequency: ENUM_HABIT_FREQUENCY!, $LastCompleted: Date) {
	createHabit(data: { Title: $Title, Active: $Active, Frequency: $Frequency, LastCompleted: $LastCompleted }) {
		data {
			id
			attributes {
				Title
				Active
				Frequency
			}
		}
	}
}
`;

export const DELETE_HABIT = gql`
mutation deleteHabit($id: ID!) {
	deleteHabit(id: $id) {
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
`;

export const UPDATE_HABIT = gql`
mutation updateHabit($id: ID!, $Active: Boolean, $Frequency: Enumeration, $LastCompleted: Date) {
	updateHabit(id: $id, data: { Active: $Active, Frequency: $Frequency, LastCompleted: $LastCompleted }) {
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
`;

export const CREATE_HABIT_HISTORY = gql`
	mutation CreateHabitHistory($data: HabitHistoryInput!) {
		createHabitHistory(data: $data) {
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
	}
`;
