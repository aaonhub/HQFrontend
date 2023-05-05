import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';

const REGISTER_USER = gql`
  mutation Register($username: String!, $email: String!, $password: String!) {
    register(input: { username: $username, email: $email, password: $password }) {
      jwt
      user {
        id
        username
        email
      }
    }
  }
`;

const RegistrationPage: React.FC = () => {
	const [values, setValues] = useState({
		username: '',
		email: '',
		password: '',
	});

	const [registerUser, { loading }] = useMutation(REGISTER_USER, {
		update(_, { data: { register: userData } }) {
			console.log(userData);
		},
		variables: values,
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
					name="password"
					placeholder="Password"
					value={values.password}
					onChange={onChange}
				/>
				<button type="submit">Register</button>
			</form>
		</div>
	)
}

export default RegistrationPage