import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import gql from 'graphql-tag';
import { Button, TextField, Container, Typography, Box, CssBaseline, Paper } from '@mui/material';

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

const emailIsValid = (email: string) => {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const RegistrationPage: React.FC = () => {
	const [values, setValues] = useState({
		username: '',
		email: '',
		password1: '',
		password2: '',
	});
	const [emailError, setEmailError] = useState(false);
	const [emailTouched, setEmailTouched] = useState(false);
	const navigate = useNavigate();

	const [registerUser] = useMutation(REGISTER_USER, {
		update(_, { data: { register: userData } }) {
			console.log(userData);
		},
		variables: values,
		onCompleted: () => {
			navigate('/login');
		},
	});

	const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		setValues({ ...values, [name]: value });

		if (name === 'email' && emailError) {
			setEmailError(!emailIsValid(value));
		}
	};

	const onBlurEmail = () => {
		setEmailTouched(true);
		setEmailError(!emailIsValid(values.email));
	};

	const onSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		if (!emailError) {
			registerUser();
		}
	};

	return (
		<Container component="main" maxWidth="xs">
			<CssBaseline />
			<Paper elevation={3} sx={{ padding: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
				<Typography variant="h5" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
					Register
				</Typography>
				<Box component="form" onSubmit={onSubmit} sx={{ mt: 3, width: '100%' }}>
					<TextField
						fullWidth
						variant="outlined"
						margin="normal"
						label="Username"
						name="username"
						value={values.username}
						onChange={onChange}
						autoComplete="off"
					/>
					<TextField
						fullWidth
						variant="outlined"
						margin="normal"
						label="Email"
						name="email"
						value={values.email}
						onChange={onChange}
						onBlur={onBlurEmail}
						autoComplete="off"
						error={emailTouched && emailError}
						helperText={emailTouched && emailError ? "Invalid email format" : ""}
					/>
					<TextField
						fullWidth
						variant="outlined"
						margin="normal"
						label="Password"
						name="password1"
						type="password"
						value={values.password1}
						onChange={onChange}
						autoComplete="off"
					/>
					<TextField
						fullWidth
						variant="outlined"
						margin="normal"
						label="Confirm Password"
						name="password2"
						type="password"
						value={values.password2}
						onChange={onChange}
						autoComplete="off"
					/>
					<Button
						type="submit"
						fullWidth
						variant="contained"
						color="primary"
						sx={{
							'&:hover': {
								backgroundColor: '#357a38',
							},
						}}
						disabled={emailTouched && emailError}
					>
						Register
					</Button>
				</Box>
			</Paper>
		</Container>
	);
};

export default RegistrationPage;
