export type Frequency = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY' | 'RITUALONLY'

class Schedule {
	frequency: Frequency | '';
	daysOfTheWeek: Array<string>;
	daysOfTheMonth: Array<number>;
	dayOfTheYear: Array<number>;
	startDate: string;
	endDate: Date | null;
	timeOfDay: string;
	// length: string;

	constructor(
		{ frequency, daysOfTheWeek, daysOfTheMonth, dayOfTheYear, startDate, endDate, timeOfDay }:
			{ frequency: Frequency | '', daysOfTheWeek: Array<string>, daysOfTheMonth: Array<number>, dayOfTheYear: Array<number>, startDate: string, endDate: Date | null, timeOfDay: string }
	) {
		this.frequency = frequency;
		this.daysOfTheWeek = daysOfTheWeek;
		this.daysOfTheMonth = daysOfTheMonth;
		this.dayOfTheYear = dayOfTheYear;
		this.startDate = startDate;
		this.endDate = endDate;
		this.timeOfDay = timeOfDay;
		// this.length = length;
	}
}

export default Schedule