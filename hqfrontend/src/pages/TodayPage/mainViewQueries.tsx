import { gql } from '@apollo/client';






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