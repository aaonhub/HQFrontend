import { gql } from '@apollo/client';
import Schedule from './schedule';
import { v4 as uuidv4 } from 'uuid';


export interface IItem {
	ritualID: string;
	title: string;
	completed: boolean;
}

export enum RitualStatus {
	Unstarted = "Unstarted",
	InProgress = "In Progress",
	Completed = "Completed"
}

export interface RitualEntry {
	ritualID: string
	entryID: string
	completedItems: any[]
	type: string
	startTime: string | null
	completedTime: Date | null
	status: RitualStatus
}

interface RitualParams {
	ritualID: string;
	title: string;
	habits: IItem[];
	ritual_items: IItem[];
	schedule: Schedule;
}

export default class Ritual {
	public ritualID: string;
	public title: string;
	public habits: IItem[];
	public ritual_items: IItem[];
	public schedule: Schedule;

	constructor({
		ritualID,
		title,
		habits,
		ritual_items,
		schedule
	}: RitualParams) {
		this.ritualID = ritualID;
		this.title = title;
		this.habits = habits;
		this.ritual_items = ritual_items;
		this.schedule = schedule;
	}
}


interface RitualsForDate {
	entries: RitualEntry[];
}



export class RitualHistoryManager {
	private ritualHistory: { [date: string]: RitualsForDate } = {};

	getRitualsByStatus(date: string, targetStatus: RitualStatus): RitualEntry[] {
		const result: RitualEntry[] = [];
		if (this.ritualHistory[date]) {
			const entries = this.ritualHistory[date].entries;
			for (let entry of entries) {
				if (entry.status === targetStatus) {
					result.push(entry);
				}
			}
		}
		return result;
	}

	doesRitualEntryExist(date: string, ritualID: string, type: string): boolean {
		const entries = this.ritualHistory[date]?.entries || [];
		return entries.some(entry => entry.ritualID === ritualID && entry.type === type);
	}

	getRitualsByCompletion(date: string): { completed: RitualEntry[], unstartedOrInProgress: RitualEntry[] } {
		const completed: RitualEntry[] = this.getRitualsByStatus(date, RitualStatus.Completed);
		const unstarted: RitualEntry[] = this.getRitualsByStatus(date, RitualStatus.Unstarted);
		const inProgress: RitualEntry[] = this.getRitualsByStatus(date, RitualStatus.InProgress);

		return {
			completed,
			unstartedOrInProgress: [...unstarted, ...inProgress]
		};
	}

	addEntry(date: string, entry: RitualEntry): void {

		if (!this.ritualHistory[date]) {
			this.ritualHistory[date] = { entries: [] };
		}

		const entries = this.ritualHistory[date].entries;

		// Generate a short unique ID for the entry
		entry.entryID = uuidv4();  // <-- Updated this

		const index = entries.findIndex(e => e.ritualID === entry.ritualID && e.type === entry.type);

		if (index > -1) {
			entries[index] = entry;
		} else {
			entries.push(entry);
		}
	}

	updateEntry(date: string, entry: RitualEntry): void {
		if (!this.ritualHistory[date]) {
			console.error('No entries for this date');
			return;
		}

		const entries = this.ritualHistory[date].entries;

		const index = entries.findIndex(e => e.ritualID === entry.ritualID && e.entryID === entry.entryID);

		if (index > -1) {
			entries[index] = entry;
		} else {
			console.error('No entry with this ID found');
		}
	}

	getEntryById(date: string, entryID: string): RitualEntry | null {
		if (this.ritualHistory[date]) {
			const entries = this.ritualHistory[date].entries;
			for (let entry of entries) {
				if (entry.entryID === entryID) {
					return entry;
				}
			}
		}
		return null;
	}

	toJson(): string {
		return JSON.stringify(this.ritualHistory);
	}

	fromJson(jsonStr: string): void {
		try {
			this.ritualHistory = JSON.parse(jsonStr);
		} catch (e) {
			console.error('Invalid JSON string', e);
		}
	}

	printRitualHistory(): void {
		console.log(this.ritualHistory);
	}

	getRitualEntriesForDate(date: string): RitualEntry[] {
		return this.ritualHistory[date]?.entries || [];
	}
}


// Adds repeat rituals to the ritual history for the given date
export function updateRitualHistoryWithRepeatRituals(
	repeatRituals: Ritual[],
	ritualHistoryManager: RitualHistoryManager,
	date: string
): RitualEntry[] {

	for (const repeatRitual of repeatRituals) {
		// Use the new method to check if this repeat ritual is already in the history for today
		const existsInHistory = ritualHistoryManager.doesRitualEntryExist(date, repeatRitual.ritualID, 'R');

		if (!existsInHistory) {
			// If not, add it as a new entry to the history
			const newEntry: RitualEntry = {
				ritualID: repeatRitual.ritualID,
				entryID: '',  // Will be generated in the addEntry method
				completedItems: [],  // Assuming you'll populate this later
				type: 'R',  // Repeat schedule
				startTime: null,
				completedTime: null,  // Assuming you'll populate this later
				status: RitualStatus.Unstarted  // Initially set to Unstarted
			};

			ritualHistoryManager.addEntry(date, newEntry);
		}
	}

	// Retrieve the updated RitualEntries for the given date and return
	return ritualHistoryManager.getRitualEntriesForDate(date);
}





// Queries
export const GET_RITUALS = gql`
	query {
		rituals {
			id
			title
		}
	}
`;

export const GET_RITUAL_AND_RITUAL_HISTORY = gql`
	query($id: ID!, $yearMonth: String!){
		ritual(id: $id) {
			id
			title
			ritualItems
			checkedItems
			inProgress
			habits{
				title
			}
		}
		ritualHistory(yearMonth: $yearMonth){
			id
			yearMonth
			data
		}
	}
`;

export const GET_RITUAL = gql`
	query Ritual($id: ID!) {
		ritual(id: $id) {
			id
			title
			ritualItems
			checkedItems
			inProgress
			habits{
				title
			}
		}
	}
`;

export const RITUAL_HISTORY_BY_MONTH = gql`
	query($yearMonth: String!){
		ritualHistory(yearMonth: $yearMonth){
			id
			yearMonth
			data
		}
	}
`;

export const RITUAL_DIALOG_QUERY = gql`
	query Ritual($id: ID!, $yearMonth: String!) {
		ritual(id: $id) {
			id
			title
			ritualItems
			checkedItems
			inProgress
			habits{
				title
			}
		}
	}
`;


// Mutations
export const CREATE_RITUAL = gql`
	mutation CreateRitual(
		$title: String!
		$habits: [ID]!
		$ritualItems: String!
		$frequency: String!
		$start_date: String!
	) {
		createRitual(
			title: $title
			habits: $habits
			ritualItems: $ritualItems
			frequency: $frequency
			startDate: $start_date
		) {
			ritual {
				id
				title
			}
		}
	}
`;

export const UPDATE_RITUAL = gql`
	mutation ($id: ID!, $title: String, $habits: [ID], $ritualItems: String, $inProgress: Boolean, $checkedItems: String) {
		updateRitual(id: $id, title: $title, habits: $habits, ritualItems: $ritualItems, inProgress: $inProgress checkedItems: $checkedItems) {
			ritual {
				id
				title
				checkedItems
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

export const UPDATE_RITUAL_HISTORY = gql`
	mutation createOrUpdateRitualHistory($data: String!, $yearMonth: String!){
		createOrUpdateRitualHistory(data: $data, yearMonth: $yearMonth){
			ritualHistory{
				id
				yearMonth
				data
			}
		}
	}
`;