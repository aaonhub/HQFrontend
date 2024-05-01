import { gql } from '@apollo/client';

export const TOKEN_AUTH_MUTATION = gql`
	mutation TokenAuth($username: String!, $password: String!) {
		tokenAuth(username: $username, password: $password) {
			payload
		}
	}
`;

export const REFRESH_TOKEN_MUTATION = gql`
	mutation RefreshToken {
		refreshToken {
			payload
		}
	}
`;

export const DELETE_TOKEN_COOKIE_MUTATION = gql`
	mutation {
		deleteTokenCookie {
			deleted
		}
	}
`;

export const DELETE_REFRESH_TOKEN_COOKIE_MUTATION = gql`
	mutation {
		deleteRefreshTokenCookie {
			deleted
		}
	}
`;