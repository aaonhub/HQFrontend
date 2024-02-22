import { gql } from '@apollo/client';
import Schedule from './schedule';


export interface IItem {
	itemID: string; // ID for sorting and habit ID is stored as (H + ID)
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
	scheduleID: string
	completedItems: any[]
	startTime: string | null
	completedTime: Date | null
	status: RitualStatus
}

interface RitualParams {
	ritualID: string;
	title: string;
	habits: IItem[];
	ritual_items: IItem[];
	schedules: Schedule[];
}

export default class Ritual {
	public ritualID: string;
	public title: string;
	public habits: IItem[];
	public ritual_items: IItem[];
	public schedules: Schedule[];

	constructor({
		ritualID,
		title,
		habits,
		ritual_items,
		schedules
	}: RitualParams) {
		this.ritualID = ritualID;
		this.title = title;
		this.habits = habits;
		this.ritual_items = ritual_items;
		this.schedules = schedules;
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

	doesRitualEntryExist(date: string, scheduleId: string): boolean {
		const entries = this.ritualHistory[date]?.entries || [];
		return entries.some(entry => entry.scheduleID === scheduleId);
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

	addOrUpdateEntry(date: string, entry: RitualEntry): void {

		// If there are no entries for this date, create a new entry
		if (!this.ritualHistory[date]) {
			this.ritualHistory[date] = { entries: [] };
		}

		// Add the entry to the entries array
		const entries = this.ritualHistory[date].entries;

		const index = entries.findIndex(e => e.ritualID === entry.ritualID);

		if (index > -1) {
			entries[index] = entry;
		} else {
			entries.push(entry);
		}
	}


	getEntryById(date: string, scheduleID: string): RitualEntry | null {
		if (this.ritualHistory[date]) {
			const entries = this.ritualHistory[date].entries;
			for (let entry of entries) {
				if (entry.scheduleID === scheduleID) {
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

	getRitualEntriesForDate(date: string): RitualEntry[] {
		return this.ritualHistory[date]?.entries || [];
	}
}


// Adds repeat rituals to the ritual history for the given date
export function generateRitualEntry(
	ritualHistoryManager: RitualHistoryManager,
	ritualId: string,
	scheduleId: string,
	date: string
): RitualEntry[] {

	// Use the new method to check if this repeat ritual is already in the history for today
	const existsInHistory = ritualHistoryManager.doesRitualEntryExist(date, scheduleId);

	if (!existsInHistory) {
		// If not, add it as a new entry to the history
		const newEntry: RitualEntry = {
			ritualID: ritualId,
			scheduleID: scheduleId,
			completedItems: [],
			startTime: null,
			completedTime: null,
			status: RitualStatus.Unstarted
		};

		ritualHistoryManager.addOrUpdateEntry(date, newEntry);

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

export const EDIT_RITUAL_DIALOG_QUERY = gql`
	query Ritual($id: ID! $yearMonth: String!){
		ritual(id: $id) {
			id
			title
			ritualItems
			checkedItems
			inProgress
			habits{
				title
			}
			schedules {
				id
				status
				visibility
				timeOfDay
				startDate
				endDate
				timezone
				recurrenceRule
				exclusionDates
				reminderBeforeEvent
				description
				priority
			}
		}
		ritualHistory(yearMonth: $yearMonth){
			id
			yearMonth
			data
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

export const EDIT_RITUAL_MUTATION = gql`
	mutation EditRitual($id: ID!, $title: String!, $ritualItems: String!, $inProgress: Boolean, $checkedItems: String) {
		editRitual(id: $id, title: $title, ritualItems: $ritualItems, inProgress: $inProgress, checkedItems: $checkedItems) {
			ritual {
				id
				title
				checkedItems
			}
		}
	}
`;