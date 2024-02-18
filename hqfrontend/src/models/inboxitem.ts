import { gql } from '@apollo/client';
import Project from './project';


interface InboxItem {
	id: string;
	title: string;
	description?: string;
	completed: boolean;
	project?: Project | null;
	dueDateTime: string | null;
	startTime: string | null;
	startDate: string | null;
	timeCompleted: Date | null;
	length?: string | null;
	masterList?: boolean;
}

class InboxItem {
	constructor(
		{ id, title, description, completed, project, dueDateTime, startTime, startDate, timeCompleted, length, masterList }:
			{
				id: string, title: string, description?: string, completed: boolean,
				project?: Project | null, dueDateTime: string | null, startTime: string | null,
				startDate: string | null, timeCompleted: Date | null, length?: string | null, masterList?: boolean
			}
	) {
		this.id = id;
		this.title = title || "";
		this.description = description || "";
		this.completed = completed || false;
		this.project = project || null;
		this.dueDateTime = dueDateTime || null;
		this.startTime = startTime || null;
		this.startDate = startDate || null;
		this.timeCompleted = timeCompleted || null;
		this.length = length || null;
		this.masterList = masterList || false;
	}
}

export default InboxItem;



// Queries
export const ITINERARY_QUERY = gql`
	query($Today: Date!, $YearMonth: String!) {
		toDoItemsByStartDate(Today: $Today) {
			id
			title
			completed
			project {
				id
				codename
			}
			dueDateTime
			description
			startDate
			startTime
			timeCompleted
			length
		}
		habitsDueToday(date: $Today) {
			id
			title
			active
			countToday
			length
			schedules {
				id
				status
				visibility
				timeOfDay
				startDate
				endDate
				timezone
				recurrenceRule
				exclusionDates
				reminderBeforeEvent
				description
				priority
			}
		}
		rituals{
			id
			title
		}
		ritualHistory(yearMonth: $YearMonth){
			id
			yearMonth
			data
		}
		settings{
			id
			itineraryOrder
		}
	}  
`;

export const MASTER_LIST_QUERY = gql`
	query MasterList {
		masterListItems{
			id
			title
			completed
		}
		settings{
			id
			masterListOrder
		}
	}
`;

export const GET_TO_DO_LIST_ITEMS_BY_START_DATE = gql`
	query($Today: Date!) {
		toDoItemsByStartDate(Today: $Today) {
			id
			title
			completed
			project {
				id
				codename
			}
			dueDateTime
			description
			startDate
			startTime
			timeCompleted
			length
		}
	}  
`;

export const GET_INBOX_TODOS = gql`
	query {
		toDoItemsWithoutProject {
			id
			title
			description
			completed
			project {
				id
			}
			dueDateTime
			startDate
			startTime
			timeCompleted
		}
	}
`;

export const GET_INBOX_TODO = gql`
	query getToDoItem($id: ID!) {
		toDoItem(id: $id) {
			id
			title
			description
			completed
			project {
				id
				codename
			}
			dueDateTime
			startDate
			startTime
			timeCompleted
			length
			masterList
		}
	}
`;

export const TO_DO_ITEM_PAGINATION = gql`
	query ToDoItems(
		$completed: Boolean, 
		$orderBy: String, 
		$title_Icontains: String,
		$after: String
	) {
		toDoItems(
			completed: $completed, 
			orderBy: $orderBy, 
			title_Icontains: $title_Icontains, 
			first: 20,
			after: $after
		) {
			edges {
				node {
					id
					title
					completed
					startDate
					dueDateTime
					description
					createdAt
				}
			}
			pageInfo {
				hasNextPage
				hasPreviousPage
				startCursor
				endCursor
			}
		}
		toDoItemPaginationCount(
			completed: $completed, 
			titleIcontains: $title_Icontains
		)
	}
`;


// Mutations
export const ADD_TODO = gql`
	mutation createToDoItem($title: String!) {
		createToDoItem( title: $title ) {
			toDoItem {
				id
				title
				completed
				dueDateTime
				description
			}
		}
	}
`;

export const ADD_TODO_TO_TODAY = gql`
	mutation createToDoItem($title: String!, $startDate: Date!) {
		createToDoItem( title: $title, startDate: $startDate ) {
			toDoItem {
				id
				title
				completed
				project {
					id
					codename
				}
				dueDateTime
				description
				startDate
				startTime
				timeCompleted
				length
			}
		}
	}
`;

export const ADD_TODO_TO_MASTER_LIST = gql`
	mutation createToDoItem($title: String!, $masterList: Boolean!) {
		createToDoItem( title: $title, masterList: $masterList ) {
			toDoItem {
				id
				title
				completed
				project {
					id
					codename
				}
				dueDateTime
				description
				startDate
				startTime
				timeCompleted
				length
				masterList
			}
		}
	}
`;

export const UPDATE_TODO = gql`
	mutation(
		$ID: ID!,
		$Completed: Boolean!,
		$Title: String,
		$Description: String,
		$ProjectId: ID,
		$StartDate: Date,
		$StartTime: Time,
		$DueDateTime: DateTime,
		$Subtasks: JSONString,
		$Length: String,
		$MasterList: Boolean
	) {
		updateToDoItem(
			completed: $Completed, 
			id: $ID,
			title: $Title,
			description: $Description,
			dueDateTime: $DueDateTime,
			projectId: $ProjectId,
			startDate: $StartDate,
			startTime: $StartTime,
			subTasks: $Subtasks
			length: $Length
			masterList: $MasterList
		) {
			toDoItem {
				id
				title
				completed
				project {
					id
					codename
				}
				dueDateTime
				description
				startDate
				startTime
				timeCompleted
				length
				masterList
			}
		}
	}
`;

export const DELETE_TODO = gql`
	mutation deleteToDoItem($id: ID!) {
		deleteToDoItem(id: $id) {
			toDoItem{
				id
			}
		}
	}
`;

export const CHECK_UNCHECK_TODO = gql`
	mutation checkUncheckToDoItem($id: ID!, $Completed: Boolean!) {
		checkUncheckToDoItem(id: $id, completed: $Completed ) {
			toDoItem {
				id
				completed
			}
		}
	}
`;

export const ADD_TODO_TO_PROJECT = gql`
	mutation updateProject($id: ID!, $to_do_items: [ID!]) {
		updateProject(id: $id, to_do_items: $to_do_items) {
			data {
				id
				attributes {
					Codename
					to_do_items {
						data {
							id
							attributes {
								Title
								Completed
								DueDateTime
								Description
							}
						}
					}
				}
			}
		}
	}
`;