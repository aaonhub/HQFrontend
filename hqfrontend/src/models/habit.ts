import { gql } from '@apollo/client';

export type HabitFrequency = {
	startDate: Date;
	endDate: Date | null;
	timeOfDay: string;
	repetitionFrequency: number;
	daysOfTheWeek: Array<string>;
	daysOfTheMonth: Array<number>;
	dayOfTheYear: number;
};

export type HabitHistory = {
	id: string;
	date: Date;
	completed: boolean;
	createdAt: Date;
	updatedAt: Date;
};

export type Frequency = 'Daily' | 'Weekly' | 'Monthly' | 'Yearly' | 'RitualOnly';

class Habit {
	constructor(
		public id: string,
		public title: string,
		public active: boolean,
		public frequency: Frequency | '',
		public lastCompleted: Date,
		public order: number,
		public habitFrequency: HabitFrequency,
		public habitHistories: Array<HabitHistory>,
		public completedToday: boolean
	) {
		this.id = id;
		this.title = title;
		this.active = active;
		this.frequency = frequency || '';
		this.lastCompleted = lastCompleted;
		this.order = order || 0;
		this.habitFrequency = habitFrequency;
		this.habitHistories = habitHistories || [];
		this.completedToday = completedToday || false;
	}
}

export default Habit;



export const GET_HABITS_DUE_TODAY = gql`
	query GetHabitsDueToday($today: Date!, $daily: StringFilterInput!, $weekly: StringFilterInput!, $monthly: StringFilterInput!, $dayOfWeek: String!, $dayOfMonth: Int!) {
		habits(pagination: { pageSize: 50 }, filters: {
			or: [
				{ Frequency: $daily },
				{ Frequency: $weekly, HabitFrequency: { DaysOfTheWeek: { eq: $dayOfWeek } } },
				{ Frequency: $monthly, HabitFrequency: { DaysOfTheMonth: { eq: $dayOfMonth } } }
			]
		}) {
			data {
				id
				attributes{
					Title
					Active
					Frequency
					LastCompleted
					Order
					HabitFrequency {
						StartDate
						EndDate
						TimeOfDay
						RepetitionFrequency
						DaysOfTheWeek
						DaysOfTheMonth
						DayOfTheYear
					}
					habit_histories(filters: {Date: {eq: $today}}) {
						data {
							id
							attributes {
								Date
								Completed
								createdAt
								updatedAt
							}
						}
					}
				}
			}
		}
	}
`;

export const GET_HABITS = gql`
query habits($Today: Date!) {
	habits {
		data {
			id
			attributes {
				Title
				Active
				Frequency
				LastCompleted
				Order
				HabitFrequency {
					StartDate
					EndDate
					TimeOfDay
					RepetitionFrequency
					DaysOfTheWeek
					DaysOfTheMonth
					DayOfTheYear
				}
				habit_histories(filters: {Date: {eq: $Today}}) {
					data {
						id
						attributes {
							Date
							Completed
							createdAt
							updatedAt
						}
					}
				}
			}
		}
	}
}
`

export const ADD_HABIT = gql`
mutation createHabit($Title: String!, $Active: Boolean!, $Frequency: ENUM_HABIT_FREQUENCY!, $LastCompleted: Date) {
	createHabit(data: { Title: $Title, Active: $Active, Frequency: $Frequency }) {
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
`

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
`

export const UPDATE_HABIT = gql`
mutation updateHabit($id: ID!, $Title: String, $Active: Boolean, $Frequency: ENUM_HABIT_FREQUENCY, $LastCompleted: Date) {
	updateHabit(id: $id, data: { Title: $Title, Active: $Active, Frequency: $Frequency, LastCompleted: $LastCompleted }) {
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

export const CREATE_HABIT_HISTORY = gql`
mutation CreateHabitHistoryAndUpdateLastCompleted($data: HabitHistoryInput!, $habitId: ID!, $lastCompleted: Date!) {
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
		updateHabit(id: $habitId, data: { LastCompleted: $lastCompleted }) {
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

export const DELETE_HABIT_HISTORY = gql`
	mutation DeleteHabitHistoryAndUpdateLastCompleted($id: ID!, $habitId: ID!, $lastCompleted: Date!) {
		deleteHabitHistory(id: $id) {
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
		updateHabit(id: $habitId, data: { LastCompleted: $lastCompleted }) {
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