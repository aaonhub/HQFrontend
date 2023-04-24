import { gql } from '@apollo/client';

import InboxItem from './inboxitem';


class Project {
	constructor(
		public id: string,
		public codename: string,
		public to_do_items?: InboxItem[]
	) {
		this.id = id
		this.codename = codename
		this.to_do_items = to_do_items
	}
}

export default Project



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

export const GET_PROJECT = gql`
	query GetProject($id: ID!) {
		project(id: $id) {
			data{
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