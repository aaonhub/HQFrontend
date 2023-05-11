import React, { useState } from 'react'
import { useMutation, gql } from '@apollo/client'
import styles from './LoginPage.module.css'

const LOGIN_MUTATION = gql`
	mutation Login($username: String!, $password: String!) {
		tokenAuth(username: $username, password: $password) {
			payload
		}
	}
`

const LoginPage = () => {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [login, { error, loading }] = useMutation(LOGIN_MUTATION, {
		onCompleted: (data) => {
			console.log(data)
			localStorage.setItem('loggedIn', 'true')
		},
	})

	const handleSubmit = async (e: any) => {
		e.preventDefault()
		try {
			await login({ variables: { username, password } })
		} catch (error) {
			console.error('Login error:', error)
		}
	}

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
		</div>
	);
};

export default LoginPage;
