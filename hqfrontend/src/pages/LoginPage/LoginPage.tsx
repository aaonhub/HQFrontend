import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';

const LOGIN_MUTATION = gql`
	mutation Login($username: String!, $password: String!) {
		tokenAuth(username: $username, password: $password) {
			payload
		}
	}
`;

const LoginPage = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [login, { error, loading }] = useMutation(LOGIN_MUTATION, {
		onCompleted: (data) => {
			console.log(data);
			localStorage.setItem('loggedIn', 'true');
		},
	});

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			await login({ variables: { username, password } });
		} catch (error) {
			console.error('Login error:', error);
		}
	};

	return (
		<div>
			<h2>Login</h2>
			<form onSubmit={handleSubmit}>
				<div>
					<label htmlFor="username">Username:</label>
					<input
						id="username"
						type="text"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
					/>
				</div>
				<div>
					<label htmlFor="password">Password:</label>
					<input
						id="password"
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
				</div>
				<button type="submit" disabled={loading}>
					Login
				</button>
			</form>
			{error && <p>Error: {error.message}</p>}
		</div>
	);
};

export default LoginPage;
