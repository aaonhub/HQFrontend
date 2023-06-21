// This is going to be a stripped down version of habits and inbox items

export class SimpleItem {
	constructor(
		public id: string,
		public completedToday: boolean,
		public title: string,
		public type: 'habit' | 'inbox',
		public startTime?: string,
		public length?: string,
	) {
		this.id = id;
		this.completedToday = completedToday;
		this.title = title;
		this.type = type;
		this.startTime = startTime;
		this.length = length;
	}
}

export default SimpleItem;