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
				data {
				id
				attributes {
					Codename
				}
			}
		}
	}
`;

export const GET_COMPLETED_PROJECT_ITEMS = gql`
	query GetProject($id: ID!) {
		project(id: $id) {
			data {
				id
				attributes {
					Codename
					ItemOrder
					to_do_items(filters: {Completed: {eq: true}}) {
						data {
							id
							attributes {
								Title
								Completed
								DueDateTime
								Description
								StartDate
								StartTime
							}
						}
					}
				}
			}
		}
	}
`;

export const GET_INCOMPLETE_PROJECT_ITEMS = gql`
	query GetProject($id: ID!) {
		project(id: $id) {
			data {
				id
				attributes {
					Codename
					ItemOrder
					to_do_items(filters: {Completed: {eq: false}}) {
						data {
							id
							attributes {
								Title
								Completed
								DueDateTime
								Description
								StartDate
								StartTime
							}
						}
					}
				}
			}
		}
	}
`;


// Mutations
export const CREATE_PROJECT = gql`
	mutation CreateProject($data: ProjectInput!) {
		createProject(data: $data) {
			data {
				id
				attributes {
					Codename
				}
			}
		}
	}
`;

export const DELETE_PROJECT = gql`
	mutation deleteProject($id: ID!) {
		deleteProject(id: $id) {
			data {
				id
			}
		}
	}
`;

export const ADD_TO_DO_TO_PROJECT = gql`
	mutation UpdateProject($id: ID!, $to_do_items: [ID!]) {
		updateProject(id: $id, to_do_items: $to_do_items) {
			id
			attributes {
				Codename
				to_do_items {
					data {
						id
						attributes {
							Title
							Completed
						}
					}
				}
			}
		}
	}
`;

export const CREATE_TO_DO_AND_ADD_TO_PROJECT = gql`
mutation CreateProjectInboxItem($projectid: ID!, $Title: String) {
	createToDoItem(data: { Title: $Title, Completed: false, project: $projectid }) {
		data {
			id
			attributes {
				Title
				project {
					data {
						id
						attributes {
							Codename
						}
					}
				}
			}
		}
	}
}  
`;

export const UPDATE_PROJECT_ITEM_ORDER = gql`
	mutation UpdateProject($id: ID!, $data: ProjectInput!) {
		updateProject(id: $id, data: $data) {
		data {
			id
			attributes {
				ItemOrder
			}
		}
	}
}
`;
