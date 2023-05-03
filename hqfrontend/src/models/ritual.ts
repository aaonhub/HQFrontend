import { gql } from '@apollo/client';

import HabitItem from './inboxitem';


export type HabitCompletion = {
	habitId: string;
	completed: boolean;
};

export type RitualHistory = {
	id: string;
	completed: boolean;
	habitCompletion: HabitCompletion[];
	startTime: Date;
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
		public ritual_history?: RitualHistory[],
		public RitualItems?: RitualItem[]
	) {
		this.id = id;
		this.title = title;
		this.habits = habits;
		this.ritual_history = ritual_history;
		this.RitualItems = RitualItems;
	}
}

export default Ritual


// Queries
export const GET_RITUALS = gql`
	query {
		rituals{
			data {
				id
				attributes {
					Title
				}
			}
		}
	}
`;


// Mutations
export const CREATE_RITUAL = gql`
	mutation CreateRitual($title: String!) {
		createRitual(data : {Title: $title}) {
			data {
				id
				attributes {
					Title
				}
			}
		}
	}
`;
