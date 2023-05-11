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
// Update to django
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

export const GET_COMPLETED_TODOS = gql`
	query {
		toDoItems(filters: { Completed: { eq: true } }, limit: 5) {
			id
			Title
			Completed
			DueDateTime
			Description
		}
	}
`;

export const GET_INCOMPLETE_TODOS = gql`
	query {
		toDoItems(filters: { Completed: { eq: false } }) {
			Title
			Completed
			DueDateTime
			Description
		}
	}
`;


// Mutations
export const ADD_TODO = gql`
  mutation createToDoItem($Title: String!) {
    createToDoItem(data: { Title: $Title, Completed: false }) {
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
`;

export const UPDATE_TODO = gql`
	mutation updateToDoItem($id: ID!, $data: ToDoItemInput!) {
		updateToDoItem(id: $id, data: $data) {
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
`;

export const DELETE_TODO = gql`
	mutation deleteToDoItem($id: ID!) {
		deleteToDoItem(id: $id) {
			data {
				id
			}
		}
	}
`;

export const COMPLETE_UNCOMPLETE_TODO = gql`
	mutation updateToDoItem($id: ID!, $Completed: Boolean!) {
		updateToDoItem(id: $id, data: { Completed: $Completed }) {
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