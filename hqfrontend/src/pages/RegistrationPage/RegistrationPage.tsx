import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import gql from 'graphql-tag';

const REGISTER_USER = gql`
	mutation Register($username: String!, $email: String!, $password1: String!, $password2: String!) {
		register(username: $username, email: $email, password1: $password1, password2: $password2) {
			user {
				id
				email
			}
		}
	}  
`;

const RegistrationPage: React.FC = () => {
	const [values, setValues] = useState({
		username: '',
		email: '',
		password1: '',
		password2: '',
	});
	const navigate = useNavigate(); // Access the navigate function from react-router-dom

	const [registerUser] = useMutation(REGISTER_USER, {
		update(_, { data: { register: userData } }) {
			console.log(userData);
		},
		variables: values,
		onCompleted: () => {
			navigate('/login');
		}
	});

	const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setValues({ ...values, [event.target.name]: event.target.value });
	};

	const onSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		registerUser();
	};

	return (
		<div>
			<h1>Register</h1>
			<form onSubmit={onSubmit}>
				<input
					type="text"
					name="username"
					placeholder="Username"
					value={values.username}
					onChange={onChange}
				/>
				<input
					type="email"
					name="email"
					placeholder="Email"
					value={values.email}
					onChange={onChange}
				/>
				<input
					type="password"
					name="password1"
					placeholder="Password"
					value={values.password1}
					onChange={onChange}
				/>
				<input
					type="password"
					name="password2"
					placeholder="Confirm Password"
					value={values.password2}
					onChange={onChange}
				/>
				<button type="submit">Register</button>
			</form>
		</div>
	);
};

export default RegistrationPage;
