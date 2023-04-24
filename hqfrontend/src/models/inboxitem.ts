import { gql } from '@apollo/client';

interface Project {

}

class InboxItem {
	constructor(
		public id: string,
		public title: string,
		public type: string,
		public completed: boolean,
		public project: Project,
		public dueDate: Date,
		public description: string,
		public startDate: Date,
		public startTime: Date
	) {
		this.id = id;
		this.title = title;
		this.type = type;
		this.completed = completed;
		this.project = project;
		this.dueDate = dueDate;
		this.description = description;
		this.startDate = startDate;
		this.startTime = startTime;
	}
}

export default InboxItem;


// Get all to do list items for today
export const GET_TODAY_LIST_ITEMS = gql`
	query GetTodaysToDoList($Today: Date!) {
		toDoItems(filters: {StartDate: {eq: $Today}}) {
			data {
				id
				attributes {
					Title
					Completed
					project {
						data {
							id
							attributes {
								Codename
							}
						}
					}
					DueDate
					Description
					StartDate
					StartTime
				}
			}
		}
	}
`;

export const GET_TODOS = gql`
  query {
    toDoItems {
      data {
        id
        attributes {
          Title
          Completed
		  DueDate
		  Description
        }
      }
    }
  }
`;

//get all completed to do items and limit it to the first 5
export const GET_COMPLETED_TODOS = gql`
	query {
		toDoItems(filters: { Completed: { eq: true } }, limit: 5) {
			data {
				id
				attributes {
					Title
					Completed
					DueDate
					Description
				}
			}
		}
	}
`;

export const GET_INCOMPLETE_TODOS = gql`
  query {
    toDoItems(filters: { Completed: { eq: false } }) {
      data {
        id
        attributes {
          Title
          Completed
          DueDate
          Description
        }
      }
    }
  }
`;

export const ADD_TODO = gql`
  mutation createToDoItem($Title: String!) {
    createToDoItem(data: { Title: $Title, Completed: false }) {
      data {
        id
        attributes {
          Title
          Completed
		  DueDate
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
					DueDate
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
					DueDate
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
								DueDate
								Description
							}
						}
					}
				}
			}
		}
	}
`;