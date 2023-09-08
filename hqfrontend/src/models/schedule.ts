

export class Schedule {
    constructor(
        public id: string,
        public title: string,
        public start_date: string,
        public end_date: string,
        public time_of_day: string,
        public days_of_week: string,
        public days_of_the_month: string,
        public days_of_the_year: string,
        public frequency: string
    ) { }
}

export default Schedule


// Queries