import { gql } from '@apollo/client';


interface DailyReviewAttributes {
	id: string;
	title: string;
	details: string;
	gratitudes: string[];
	majorEvents: string[];
	date: string;
}

class DailyReview {
	constructor({
		id,
		title,
		details,
		gratitudes,
		majorEvents,
		date,
	}: DailyReviewAttributes) {
		this.id = id;
		this.title = title;
		this.details = details;
		this.gratitudes = gratitudes;
		this.majorEvents = majorEvents;
		this.date = date;
	}

	id: string;
	title: string;
	details: string;
	gratitudes: string[];
	majorEvents: string[];
	date: string;
}

export default DailyReview;



// Queries
// Updated to django
export const GET_DAILY_REVIEW = gql`
	query GetDailyReview($id: ID!) {
		dailyReview(id: $id) {
			id
			title
			gratitudeList
			majorEvents
			details
		}
	}
`;

// Updated to django
export const GET_DAILY_REVIEW_BY_DATE = gql`
	query GetDailyReviewByDate($date: Date!) {
		dailyReviews(date: $date) {
			id
			title
			gratitudeList
			majorEvents
			details
			date
		}
	}
`;

// Updated to django
export const GET_DAILY_REVIEWS = gql`
	query {
		dailyReviews{
			id
			title
			date
		}
	}
`;


// Mutations
// Updated to django
export const CREATE_DAILY_REVIEW = gql`
	mutation CreateDailyReview( 
		$title: String,
		$gratitudeList: JSONString,
		$majorEvents: JSONString,
		$details: String,
		$date: Date!
	) {
		createDailyReview(
			title: $title, 
			gratitudeList: $gratitudeList, 
			majorEvents: $majorEvents, 
			details: $details
			date: $date
		) {
			dailyReview {
				id
				title
				details
				gratitudeList
				majorEvents
				date
			}
		}
	}
`;

// Updated to django
export const UPDATE_DAILY_REVIEW = gql`
	mutation UpdateDailyReview( 
		$id: ID! 
		$title: String! 
		$gratitudeList: JSONString!, 
		$majorEvents: JSONString! 
		$details: String!
	) {
		updateDailyReview(
			id: $id, 
			title: $title, 
			gratitudeList: $gratitudeList, 
			majorEvents: $majorEvents, 
			details: $details
		) {
			dailyReview {
				id
				title
				details
				gratitudeList
				majorEvents
				date
			}
		}
	}
`;
