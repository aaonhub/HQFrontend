import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';

const LOGIN_MUTATION = gql`
  mutation Login($identifier: String!, $password: String!) {
    login(input: { identifier: $identifier, password: $password }) {
      jwt
      user {
        id
        username
        email
      }
    }
  }
`;

const LoginPage = () => {
	const [identifier, setIdentifier] = useState('');
	const [password, setPassword] = useState('');
	const [login, { data, error, loading }] = useMutation(LOGIN_MUTATION);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			const { data } = await login({ variables: { identifier, password } });
			localStorage.setItem('jwtToken', data.login.jwt);
		} catch (error) {
			console.error('Login error:', error);
		}
	};

	return (
		<div>
			<h2>Login</h2>
			<form onSubmit={handleSubmit}>
				<div>
					<label htmlFor="identifier">Email or Username:</label>
					<input
						id="identifier"
						type="text"
						value={identifier}
						onChange={(e) => setIdentifier(e.target.value)}
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
				<button type="submit" disabled={loading}>Login</button>
			</form>
			{error && <p>Error: {error.message}</p>}
		</div>
	)
}

export default LoginPage