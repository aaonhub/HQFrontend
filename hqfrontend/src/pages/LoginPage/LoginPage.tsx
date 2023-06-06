import React, { useState } from 'react'
import { useMutation, gql, useQuery } from '@apollo/client'
import { Link, useNavigate } from 'react-router-dom'
import styles from './LoginPage.module.css'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Stack from '@mui/material/Stack'

import { MY_PROFILE } from '../../models/social'

// Globals
import { useGlobalContext } from '../App/GlobalContextProvider'

const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    tokenAuth(username: $username, password: $password) {
      payload
    }
  }
`;

const LoginPage = () => {
	const { setLoggedIn, setGlobalProfile } = useGlobalContext();
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const navigate = useNavigate(); // Access the navigate function from react-router-dom
	const [showAlert, setShowAlert] = useState(false); // State to control the visibility of the alert

	const { refetch } = useQuery(MY_PROFILE, {
		onCompleted: (data) => {
			console.log(data);
			setGlobalProfile(data.myProfile);
		}
	});

	const [login] = useMutation(LOGIN_MUTATION, {
		onCompleted: (data) => {
			console.log(data);
			setLoggedIn(true);
			refetch();
			localStorage.setItem('loggedIn', 'true');
			navigate('/'); // Redirect to root URL after successful login
		},
	});

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			await login({ variables: { username: username, password } });
		} catch (error) {
			console.error('Login error:', error);
			setShowAlert(true); // Show the alert when login fails
		}
	};

	return (
		<div className={styles.login}>
			<h1>Login</h1>
			<form onSubmit={handleSubmit}>
				<input
					type="text"
					name="username"
					placeholder="Username"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
				/>
				<input
					type="password"
					name="password"
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				<button
					type="submit"
					className={`${styles.btn} ${styles.btnPrimary} ${styles.btnBlock} ${styles.btnLarge}`}
				>
					Let me in.
				</button>
			</form>

			{showAlert && ( // Render the alert component conditionally
				<Stack sx={{ width: '100%', marginBottom: '1rem' }} spacing={2}>
					<Alert severity="error">
						<AlertTitle>Login Failed</AlertTitle>
						Please check your credentials and try again.
					</Alert>
				</Stack>
			)}

			{/* Add a Link to the registration page */}
			<p>
				Don't have an account?{' '}
				<Link to="/register" className={styles.registerLink}>
					Register here
				</Link>
			</p>
		</div>
	);
};

export default LoginPage;
