import React, { useState } from 'react';
import { useMutation, gql, useQuery } from '@apollo/client';
import { Link, useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import { MY_PROFILE } from '../../models/social';
import { useGlobalContext } from '../App/GlobalContextProvider';

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
	const navigate = useNavigate();
	const [showAlert, setShowAlert] = useState(false);

	const { refetch } = useQuery(MY_PROFILE, {
		onCompleted: (data) => {
			setGlobalProfile(data.myProfile);
		},
	});

	const [login] = useMutation(LOGIN_MUTATION, {
		onCompleted: (data) => {
			setLoggedIn(true);
			refetch();
			localStorage.setItem('loggedIn', 'true');
			navigate('/');
		},
	});

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			await login({ variables: { username, password } });
		} catch (error) {
			setShowAlert(true);
		}
	};

	return (
		<Paper elevation={3} style={{ padding: '2rem', maxWidth: '400px', margin: 'auto' }}>
			<Typography variant="h4" gutterBottom>
				Login
			</Typography>

			<form onSubmit={handleSubmit}>
				<TextField
					fullWidth
					margin="normal"
					label="Username"
					variant="outlined"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
				/>
				<TextField
					fullWidth
					margin="normal"
					label="Password"
					type="password"
					variant="outlined"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				<Button variant="contained" color="primary" type="submit">
					Let me in.
				</Button>
			</form>

			{showAlert && (
				<Stack sx={{ width: '100%', marginTop: '1rem' }} spacing={2}>
					<Alert severity="error">
						<AlertTitle>Login Failed</AlertTitle>
						Please check your credentials and try again.
					</Alert>
				</Stack>
			)}

			<Typography variant="body2" style={{ marginTop: '1rem' }}>
				Don't have an account?{' '}
				<Link to="/register">
					Register here
				</Link>
			</Typography>
		</Paper>
	);
};

export default LoginPage;
