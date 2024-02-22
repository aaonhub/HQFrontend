// Models
import Habit from "./habit"
import InboxItem from "./inboxitem"
import { RitualEntry, RitualStatus } from "./ritual"

export class SimpleItem {
	constructor(
		public id: string,
		public itemId: string,
		public completedToday: boolean,
		public title: string,
		public type: 'habit' | 'inbox' | 'ritual',
		public startTime?: string,
		public length?: string,
		public description?: string,
		public ritualID?: string
	) {
		this.id = id;
		this.itemId = itemId;
		this.completedToday = completedToday;
		this.title = title;
		this.type = type;
		this.startTime = startTime;
		this.length = length;
		this.description = description;
		this.ritualID = ritualID;
	}
}

export default SimpleItem;


