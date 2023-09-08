// Models
import Habit from "./habit"
import InboxItem from "./inboxitem"
import { RitualEntry, RitualStatus } from "./ritual"

export class SimpleItem {
	constructor(
		public id: string,
		public completedToday: boolean,
		public title: string,
		public type: 'habit' | 'inbox' | 'ritual',
		public startTime?: string,
		public length?: string,
		public startDate?: string,
		public description?: string,
		public ritualID?: string
	) {
		this.id = id;
		this.completedToday = completedToday;
		this.title = title;
		this.type = type;
		this.startTime = startTime;
		this.length = length;
		this.startDate = startDate;
		this.description = description;
		this.ritualID = ritualID;
	}
}

export default SimpleItem;



// Convert habits to SimpleItems
export function habitsToSimpleItems(habits: Habit[]): SimpleItem[] {
	const simpleItems: SimpleItem[] = [];
	if (habits) {
		habits.forEach((habit) => {
			simpleItems.push({
				id: habit.id + "h",
				completedToday: habit.countToday > 0,
				title: habit.title ?? '',
				type: 'habit',
				startTime: habit.timeOfDay ?? "",
				startDate: habit.startDate ?? "",
			});
		});
	}
	return simpleItems;
}

// Convert inbox items to SimpleItems
export function inboxItemsToSimpleItems(inboxItems: InboxItem[]): SimpleItem[] {
	const simpleItems: SimpleItem[] = [];
	if (inboxItems) {
		inboxItems.forEach((inboxItem) => {
			simpleItems.push({
				id: inboxItem.id + "i",
				completedToday: inboxItem?.completed ?? false,
				title: inboxItem.title ?? '',
				type: 'inbox',
				startTime: inboxItem.startTime ? inboxItem.startTime : undefined,
				length: inboxItem.length ? inboxItem.length : undefined,
				startDate: inboxItem.startDate ?? undefined,
				description: inboxItem.description ?? undefined,
			});
		});
	}
	return simpleItems;
}

// Convert rituals to SimpleItems
export function ritualsToSimpleItems(ritualEntries: RitualEntry[], rituals: any): SimpleItem[] {
	return ritualEntries.map((entry) => {
		// Find the corresponding Ritual object to get the title and other details
		const correspondingRitual = rituals.find((ritual: any) => ritual.id === entry.ritualID);

		return {
			id: entry.entryID + "r",
			completedToday: entry.status === RitualStatus.Completed,
			title: correspondingRitual ? correspondingRitual.title : 'notfound', // Retrieve from the Ritual object
			type: 'ritual',
			startTime: entry.startTime ? entry.startTime.toString() : "",
			startDate: correspondingRitual ? correspondingRitual.schedule.start_date : '',  // Retrieve from the Ritual object
			ritualID: entry.ritualID,
		};
	});
}