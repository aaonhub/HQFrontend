import { 
	// useContext, 
	useEffect, useState } from 'react';
// import { ThemeContext } from './ThemeContext';
import { 
	// FormControl, InputLabel, MenuItem, Select, 
	TextField, Box, Snackbar, Alert, Typography, Button } from '@mui/material';
import { useMutation, gql } from '@apollo/client';

// Globals
import { useGlobalContext } from '../App/GlobalContextProvider';

// Queries and Mutations
import { CHANGE_CODENAME } from '../../models/social';


const DELETE_REFRESH_TOEKN_MUTATION = gql`
	mutation {
		deleteRefreshTokenCookie{
			deleted
		}
	}
`


const SettingsPage = () => {
	// const { currentTheme, setTheme } = useContext(ThemeContext);
	const { setLoggedIn, globalProfile, setGlobalProfile } = useGlobalContext()

	const [codeName, setCodeName] = useState<string>(globalProfile.codename);
	const [message, setMessage] = useState<string>("");
	const [showSnackbar, setShowSnackbar] = useState<boolean>(false);
	const [alertSeverity, setAlertSeverity] = useState<"success" | "error" | "info" | "warning">("success");



	useEffect(() => {
		setCodeName(globalProfile.codename);
	}, [globalProfile])



	// Logout
	const [deleteRefreshTokenCookie] = useMutation(DELETE_REFRESH_TOEKN_MUTATION, {
		onCompleted: () => {
			setLoggedIn(false)
			localStorage.removeItem('loggedIn')
		}
	})
	const handleLogout = () => {
		setGlobalProfile({})
		deleteRefreshTokenCookie()
	}

	// Mutations
	const [updateProfile] = useMutation(CHANGE_CODENAME, {
		onCompleted: (data: any) => {
			console.log(data);
			setMessage("Codename updated successfully!");
			setAlertSeverity("success");
			setShowSnackbar(true);
		},
		onError: (error: any) => {
			setMessage(error.message);
			if (error.message.includes("This is already your codename.")) {
				setAlertSeverity("info");
			} else {
				setAlertSeverity("error");
			}
			setShowSnackbar(true);
		}
	});

	// const handleChange = (event: any) => {
	// 	setTheme(event.target.value);
	// };

	const handleChangeCodeName = (event: any) => {
		updateProfile({
			variables: {
				codename: codeName
			}
		})
	}


	return (
		<Box mt={2} mx={2}>

			<Box mb={2}>
				<Typography variant="h3">Settings</Typography>
			</Box>

			{/* Set Theme */}
			{/* <Box mb={2}>
				<FormControl variant="outlined">
					<InputLabel>Theme</InputLabel>
					<Select
						value={currentTheme}
						onChange={handleChange}
						label="Theme"
					>
						<MenuItem value="light">Light</MenuItem>
						<MenuItem value="dark">Dark</MenuItem>
						<MenuItem value="pink">Pink</MenuItem>
					</Select>
				</FormControl>
			</Box> */}


			{/* Set Codename */}
			<TextField
				label="Code Name"
				value={codeName}
				autoComplete="off"
				onChange={(e) => setCodeName(e.target.value)}
				onKeyDown={(e) => {
					if (e.key === "Enter") {
						handleChangeCodeName(e);
					}
				}}
			/>


			{/* Logout */}
			<Box mt={2}>
				<Button variant="contained" color="error" onClick={handleLogout}>Logout</Button>
			</Box>


			{/* Snackbar */}
			<Snackbar open={showSnackbar} autoHideDuration={6000} onClose={() => setShowSnackbar(false)}>
				<Alert onClose={() => setShowSnackbar(false)} severity={alertSeverity}>
					{message}
				</Alert>
			</Snackbar>

		</Box>
	);
};

export default SettingsPage;
