import { gql } from '@apollo/client';

export const GET_PROJECTS = gql`
	query GetProjects {
		projects {
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
							}
						}
					}
				}
			}
		}
	}
`;

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
export const CREATE_PROJECT = gql`
	mutation CreateProject($codename: String!) {
		createProject(codename: $codename) {
			id
			attributes {
				Codename
			}
		}
	}
`;

//delete project
export const DELETE_PROJECT = gql`
	mutation DeleteProject($id: ID!) {
		deleteProject(id: $id) {
			id
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