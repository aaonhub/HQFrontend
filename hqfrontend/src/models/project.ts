import { gql } from '@apollo/client';

import InboxItem from './inboxitem';


class Project {
	constructor(
		public id: string,
		public codename: string,
		public to_do_items?: InboxItem[],
		public item_order?: string[]
	) {
		this.id = id
		this.codename = codename
		this.to_do_items = to_do_items
		this.item_order = item_order
	}
}

export default Project


// Queries
export const GET_PROJECTS = gql`
	query GetProjects {
		projects {
			id
			codename
		}
	}
`;

export const GET_PROJECT_ITEMS = gql`
	query GetProjectToDoItems($projectId: ID!, $completed: Boolean) {
		project(id: $projectId) {
			id
			codename
			toDoItems(completed: $completed) {
				id
				title
				completed
				dueDateTime
				description
				startDate
				startTime
			}
			itemOrder
		}
	}  
`;



// Mutations
export const CREATE_PROJECT = gql`
	mutation CreateProject($codename: String!) {
		createProject(codename: $codename) {
			project {
				id
				codename
			}
		}
	}
`;

export const DELETE_PROJECT = gql`
	mutation deleteProject($id: ID!) {
		deleteProject(id: $id) {
			success
		}
	}
`;


export const CREATE_TO_DO_AND_ADD_TO_PROJECT_AT_POSITION = gql`
    mutation ($projectId: ID!, $title: String!, $position: Int!) {
        createToDoAndAddToProject(projectId: $projectId, title: $title, position: $position) {
            project {
                id
				codename
            }
        }
    }
`;


export const UPDATE_PROJECT_ITEM_ORDER = gql`
	mutation UpdateProject($id: ID!, $itemOrder: [String!]!) {
		updateProjectItemOrder(id: $id, itemOrder: $itemOrder) {
			project {
				id
				codename
				itemOrder
			}
		}
	}
`;
