// This is going to be a stripped down version of habits and inbox items

export class SimpleItem {
	constructor(
		public completedToday: boolean,
		public title: string,
		public type: 'habit' | 'inbox',
		public id: string,
		public startTime: Date,
	) {
		this.completedToday = completedToday;
		this.title = title;
		this.type = type;
		this.id = id;
		this.startTime = startTime;
	}
}

export default SimpleItem;