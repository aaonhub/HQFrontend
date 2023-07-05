// This is going to be a stripped down version of habits and inbox items

export class SimpleItem {
	constructor(
		public id: string,
		public completedToday: boolean,
		public title: string,
		public type: 'habit' | 'inbox',
		public startTime?: string,
		public length?: string,
		public startDate?: Date,
		public description?: string
	) {
		this.id = id;
		this.completedToday = completedToday;
		this.title = title;
		this.type = type;
		this.startTime = startTime;
		this.length = length;
		this.startDate = startDate;
		this.description = description;
	}
}

export default SimpleItem;