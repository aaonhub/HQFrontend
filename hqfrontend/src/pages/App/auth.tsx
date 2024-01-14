// auth.js
import { useEffect } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { MY_PROFILE } from '../../models/social';

const REFRESH_TOKEN_MUTATION = gql`
	mutation refreshToken {
		refreshToken {
			payload
		}
	}
`;

export const useAuth = (setLoggedIn: (value: boolean) => void, setGlobalProfile: (username: string) => void) => {


	const { refetch } = useQuery(MY_PROFILE, {
		onCompleted: (data) => {
			setGlobalProfile(data.myProfile);
		},
		onError: () => {
			setGlobalProfile("");
		}
	});
	

	const [refreshToken] = useMutation(REFRESH_TOKEN_MUTATION, {
		onError: () => {
			setLoggedIn(false);
			localStorage.removeItem('loggedIn');
			setGlobalProfile("");
		},
		onCompleted: (data) => {
			setLoggedIn(true);
			localStorage.setItem('loggedIn', "true");
			refetch();
		}
	});


	useEffect(() => {
		// Run refresh token mutation every 25 minutes
		refreshToken();
		setInterval(() => {
			refreshToken();
			console.log("Refresh on interval");
		}, 25 * 60 * 1000);
	}, [refreshToken]);

};
