import { gql } from '@apollo/client'


interface DayTitle {
	day: number;
	title: string;
}

interface MonthDayTitles {
	month: number;
	titles: DayTitle[];
}

class MonthDayTitles {
	constructor(month: number, year: number) {
		this.month = month;

		// Generate titles for each day of the month with blank title
		this.titles = this.generateDayTitles(year);
	}

	// Determine how many days are in the month
	private getDaysInMonth(year: number): number {
		return new Date(year, this.month, 0).getDate();
	}

	// Generate an array of DayTitle objects for each day of the month with blank title
	private generateDayTitles(year: number): DayTitle[] {
		const daysInMonth = this.getDaysInMonth(year);
		const titles: DayTitle[] = [];

		for (let i = 1; i <= daysInMonth; i++) {
			titles.push({ day: i, title: '' });
		}

		return titles;
	}
}

interface YearDayTitles {
	year: number;
	months: MonthDayTitles[];
}

class YearDayTitles {
	constructor(year: number, initialMonths?: MonthDayTitles[]) {
		this.year = year;
		this.months = initialMonths || this.generateMonths();
	}

	// Generate an array of MonthDayTitles objects for each month of the year
	private generateMonths(): MonthDayTitles[] {
		const months: MonthDayTitles[] = [];

		for (let i = 1; i <= 12; i++) {
			months.push(new MonthDayTitles(i, this.year));
		}

		return months;
	}
}

export default YearDayTitles;






// Queries
export const GET_DAY_TITLES_BY_YEAR = gql`
	query dayTitlesByYear($year: Int!) {
		dayTitlesByYear(year: $year) {
			id
			year
			titles
		}
	}
`;


// Mutations
export const CREATE_DAY_TITLES = gql`
	mutation createDayTitles($year: Int!, $titles: String!) {
		createDayTitles(year: $year, titles: $titles) {
			dayTitles {
				id
				year
				titles
			}
		}
	}
`;

export const UPDATE_DAY_TITLES = gql`
	mutation updateDayTitles($id: ID!, $year: Int!, $titles: String!) {
		updateDayTitles(id: $id, year: $year, titles: $titles) {
			dayTitles {
				id
				year
				titles
			}
		}
	}
`;