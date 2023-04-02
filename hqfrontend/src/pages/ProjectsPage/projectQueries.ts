import { gql } from '@apollo/client';

// WORKING
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

// WORKING
export const GET_PROJECT = gql`
	query GetProject($id: ID!) {
		project(id: $id) {
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

//make project
// WORKING
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

//delete project
// WORKING
export const DELETE_PROJECT = gql`
	mutation deleteProject($id: ID!) {
		deleteProject(id: $id) {
			data {
				id
			}
		}
	}
`;

//update project to add to do list items to it
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