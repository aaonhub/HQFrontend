import { gql } from '@apollo/client';

export const MY_PROFILE = gql`
	query me {
		myProfile {
			id
			bio
			birthDate
			location
			codename
			friends {
				id
				codename
			}
		}
	}
`;

export const CHANGE_CODENAME = gql`
	mutation updateCodename($codename: String!) {
		changeCodename(codename: $codename){
			profile {
				id
				codename
			}
		}
	}
`;