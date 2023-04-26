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

class Ritual {
	constructor(
		public id: string,
		public title: string,
		public habits: HabitItem[],
		public ritual_history?: RitualHistory[]
	) {
		this.id = id;
		this.title = title;
		this.habits = habits;
		this.ritual_history = ritual_history;
	}
}

export default Ritual


