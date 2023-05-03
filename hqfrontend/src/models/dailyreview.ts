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
export const GET_DAILY_REVIEW = gql`
	query GetDailyReview($id: ID!) {
		dailyReview(id: $id) {
			data {
				id
				attributes {
					Title
					GratitudeList
					MajorEvents
					Details
				}
			}
		}
	}
`;

export const GET_DAILY_REVIEW_BY_DATE = gql`
	query GetDailyReviewByDate($date: Date!) {
		dailyReviews (filters: {Date: {eq: $date}}) {
			data {
				id
				attributes {
					Title
					GratitudeList
					MajorEvents
					Details
					Date
				}
			}
		}
	}
`;

export const GET_DAILY_REVIEWS = gql`
	query {
		dailyReviews{
			data {
				id
				attributes {
					Title
					Date
				}
			}
		}
	}
`;


// Mutations
export const CREATE_DAILY_REVIEW = gql`
	mutation CreateDailyReview( 
		$title: String,
		$gratitudeList: JSON,
		$majorEvents: JSON,
		$details: String,
		$date: Date!
	) {
		createDailyReview(data : { 
			Title: $title, 
			GratitudeList: $gratitudeList, 
			MajorEvents: $majorEvents, 
			Details: $details
			Date: $date
		}) {
			data {
				id
				attributes {
					Title          
				}
			}
		}
	}
`;

export const UPDATE_DAILY_REVIEW = gql`
	mutation UpdateDailyReview( 
		$id: ID! 
		$title: String! 
		$gratitudeList: JSON!, 
		$majorEvents: JSON! 
		$details: String!
	) {
		updateDailyReview(id: $id, data : { Title: $title, GratitudeList: $gratitudeList, MajorEvents: $majorEvents, Details: $details}) {
			data {
				id
				attributes {
					Title          
				}
			}
		}
	}
`;
