import { gql } from '@apollo/client';
import Project from './project';


interface InboxItem {
	id: string;
	title: string;
	description?: string;
	completed: boolean;
	project?: Project | null;
	dueDateTime: Date | null;
	startTime: string | null;
	startDate: string | null;
	timeCompleted: Date | null;
}

class InboxItem {
	constructor({
		id,
		title,
		description,
		completed,
		project,
		dueDateTime,
		startTime,
		startDate,
		timeCompleted,

	}: InboxItem) {
		this.id = id;
		this.title = title || "";
		this.description = description || "";
		this.completed = completed || false;
		this.project = project || null;
		this.dueDateTime = dueDateTime;
		this.startTime = startTime;
		this.startDate = startDate;
		this.timeCompleted = timeCompleted;
	}
}

export default InboxItem;



// Queries
export const GET_TODAY_LIST_ITEMS = gql`
	query GetTodaysToDoList($Today: Date!) {
		toDoItems(Today: $Today) {
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
		}
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
				dueDateTime
				description
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
		$Subtasks: JSONString
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
		) {
			toDoItem {
				id
				title
				completed
				project{
					id
					codename
				}
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
				title
				completed
				dueDateTime
				description
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