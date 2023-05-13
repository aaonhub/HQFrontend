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

export type OrderType = {
	id: string;
	completed: boolean;
};

class Ritual {
	constructor(
		public id: string,
		public title: string,
		public habits: HabitItem[],
		public ritual_items: RitualItem[],
		public order: OrderType[]
	) {
		this.id = id;
		this.title = title;
		this.habits = habits;
		this.ritual_items = ritual_items;
		this.order = order;
	}
}

export default Ritual


// Queries
// Updated to django
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
			habits {
				id
				title
			}
			ritualItems
			ritualOrder
		}
	}
`;


// Mutations
export const CREATE_RITUAL = gql`
	mutation CreateRitual(
		$title: String!
		$habits: [ID]!
		$ritualItems: JSONString!
		$ritualOrder: JSONString!
	) {
		createRitual(
			title: $title
			habits: $habits
			ritualItems: $ritualItems
			ritualOrder: $ritualOrder
		) {
			ritual {
				id
				title
			}
		}
	}
`;
