import { gql } from '@apollo/client';


export type HabitItem = {
	id: string;
	title: string;
	completed: boolean;
};

export type RitualItem = {
	id: string;
	title: string;
	completed: boolean;
};

class Ritual {
	constructor(
		public id: string,
		public title: string,
		public habits: HabitItem[],
		public ritual_items: RitualItem[],
	) {
		this.id = id;
		this.title = title;
		this.habits = habits;
		this.ritual_items = ritual_items;
	}
}

export default Ritual


// Queries
export const GET_RITUALS = gql`
	query {
		rituals {
			id
			title
		}
	}
`;

export const GET_RITUAL = gql`
	query Ritual($id: ID!) {
		ritual(id: $id) {
			id
			title
			ritualItems
			inProgress
		}
	}
`;


// Mutations
export const CREATE_RITUAL = gql`
	mutation CreateRitual(
		$title: String!
		$habits: [ID]!
		$ritualItems: JSONString!
		$frequency: String!
		$start_date: String!
		$end_date: String!
		$time_of_day: String!
		$days_of_the_week: [String]!
		$days_of_the_month: [Int]!
		$days_of_the_year: Int!
	) {
		createRitual(
			title: $title
			habits: $habits
			ritualItems: $ritualItems
			frequency: $frequency
			startDate: $start_date
			endDate: $end_date
			timeOfDay: $time_of_day
			daysOfTheWeek: $days_of_the_week
			daysOfTheMonth: $days_of_the_month
			daysOfTheYear: $days_of_the_year
		) {
			ritual {
				id
				title
			}
		}
	}
`;

export const START_RITUAL = gql`
	mutation ($ritualId: ID!) {
		startRitual(ritualId: $ritualId) {
			ritual {
				id
				title
			}
		}
	}
`;

export const COMPLETE_RITUAL = gql`
	mutation ($ritualId: ID!, $status: String!) {
		finishRitual(ritualId: $ritualId, status: $status) {
			ritual {
				id
				title
			}
		}
	}
`;

export const UPDATE_RITUAL = gql`
	mutation ($id: ID!, $title: String, $habits: [ID], $ritualItems: JSONString, $inProgress: Boolean) {
		updateRitual(id: $id, title: $title, habits: $habits, ritualItems: $ritualItems, inProgress: $inProgress) {
			ritual {
				id
				title
			}
		}
	}
`;

export const DELETE_RITUAL = gql`
	mutation ($ritualId: ID!) {
		deleteRitual(ritualId: $ritualId) {
			ritual {
				id
				title
			}
		}
	}
`;