// auth.js
import { useEffect } from 'react';
import { gql, useMutation } from '@apollo/client';

const REFRESH_TOKEN_MUTATION = gql`
	mutation refreshToken {
		refreshToken {
			payload
		}
	}
`;

export const useAuth = (setLoggedIn: (value: boolean) => void, setGlobalUsername: (username: string) => void) => {

	let retryCount = 0;
	const MAX_RETRIES = 2;

	const [refreshToken] = useMutation(REFRESH_TOKEN_MUTATION, {
		onError: () => {
			if (retryCount < MAX_RETRIES) {
				retryCount++;
				refreshToken();
			} else {
				setLoggedIn(false);
				localStorage.removeItem('loggedIn');
				setGlobalUsername("");
			}
		},
		onCompleted: (data) => {
			retryCount = 0;  // reset the retry count after a successful request
			setLoggedIn(true);
			localStorage.setItem('loggedIn', "true");
			setGlobalUsername(data.refreshToken.payload.username);
		}
	});

	useEffect(() => {
		// Run refresh token mutation every 25 minutes
		refreshToken();
		setInterval(() => {
			refreshToken();
			console.log("Refresh on interval");
		}, 25 * 60 * 1000);
		console.log("Refresh");
	}, [refreshToken]);

};
