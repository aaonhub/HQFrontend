import { gql } from '@apollo/client';


export type AccountabilityType = 'Basic' | 'Habit Tracking'


class Accountability {
	id: string;
	type: AccountabilityType;
	description: string;
	startDate: string;
	endDate: string;
	data: any;
	winner: string;
	organizer: string;
	participants: string[];

	constructor({
		id,
		type,
		description,
		startDate,
		endDate,
		data,
		winner,
		organizer,
		participants,
	}: {
		id: string;
		type: AccountabilityType;
		description: string;
		startDate: string;
		endDate: string;
		data: any;
		winner: string;
		organizer: string;
		participants: string[];
	}) {
		this.id = id;
		this.type = type;
		this.description = description;
		this.startDate = startDate;
		this.endDate = endDate;
		this.data = data;
		this.winner = winner;
		this.organizer = organizer;
		this.participants = participants;
	}
}

export default Accountability;


// Queries
export const GET_FRIEND_REQUESTS = gql`
	query {
		incomingFriendRequests {
			id
			codename
		}
	}
`;

export const GET_FRIENDS = gql`
	query {
		friendList {
			id
			codename
			userId
		}
	}
`;

export const GET_ACCOUNTABILITIES = gql`
	query {
		myAccountabilities {
			id
			name
			status
		}
	}
`;

export const GET_ACCOUNTABILITY = gql`
	query ($id: ID!) {
		getAccountability(id: $id) {
			id
			name
			description
			startDate
			endDate
			type
			pendingParticipants{
				codename
			}
			participants {
				codename
			}
			organizer {
				codename
			}
		}
	}
`;


// Mutations
export const SEND_FRIEND_REQUEST = gql`
	mutation SendFriendRequest($codename: String!) {
		sendFriendRequest(codename: $codename) {
			message
		}
	}
`;

export const ACCEPT_FRIEND_REQUEST = gql`
	mutation acceptFriendRequest($codename: String!) {
		acceptFriendRequest(codename: $codename){
			message
		}
	}
`;

export const DECLINE_FRIEND_REQUEST = gql`
	mutation declineFriendRequest($codename: String!) {
		declineFriendRequest(codename: $codename){
			message
		}
	}
`;

export const CREATE_ACCOUNTABILITY = gql`
	mutation (
		$name: String!
		$description: String
		$endDate: Date
		$pendingParticipants: [ID]!
		$startDate: Date!
		$type: String!
	) {
		createAccountability(
			name: $name,
			description: $description, 
			endDate: $endDate,
			pendingParticipants: $pendingParticipants,
			startDate: $startDate, 
			type: $type
		) {
			accountability {
				id
			}
		}
	}
`;