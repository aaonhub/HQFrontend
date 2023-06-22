import {
	// useContext, 
	useEffect, useState
} from 'react';
// import { ThemeContext } from './ThemeContext';
import {
	// FormControl, InputLabel, MenuItem, Select, 
	TextField, Box, Typography, Button
} from '@mui/material';
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

const DELETE_TOKEN_MUTATION = gql`
	mutation {
		deleteTokenCookie{
			deleted
		}
	}
`


const SettingsPage = () => {
	// Tab Title
	useEffect(() => {
		document.title = "Settings - HQ";
	}, []);

	// const { currentTheme, setTheme } = useContext(ThemeContext);
	const { setLoggedIn, globalProfile, setGlobalProfile, setSnackbar } = useGlobalContext()
	const [codeName, setCodeName] = useState<string>(globalProfile.codename);



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
	const [deleteTokenCookie] = useMutation(DELETE_TOKEN_MUTATION, {
		onCompleted: () => {
			setLoggedIn(false)
			localStorage.removeItem('loggedIn')
		}
	})
	const handleLogout = () => {
		setGlobalProfile({})
		deleteRefreshTokenCookie()
		deleteTokenCookie()
	}

	// Mutations
	const [updateProfile] = useMutation(CHANGE_CODENAME, {
		onCompleted: (data: any) => {
			console.log(data);
			setSnackbar({
				message: "Codename updated successfully!",
				severity: "success",
				open: true
			});
		},
		onError: (error: any) => {
			let AlertSeverity: any = "error";
			if (error.message.includes("This is already your codename.")) {
				AlertSeverity = "warning";
			} else {
				AlertSeverity = "error";
			}
			setSnackbar({
				message: error.message,
				severity: AlertSeverity,
				open: true
			});
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

			<Box mt={2}>
				<Button
					variant="contained"
					color="primary"
					disabled={codeName === globalProfile.codename}
					onClick={handleChangeCodeName}
				>
					Change Codename
				</Button>
			</Box>


			{/* Logout */}
			<Box mt={2} position="absolute" bottom="0">
				<Button variant="contained" color="error" onClick={handleLogout}>Logout</Button>
			</Box>

		</Box>
	);
};

export default SettingsPage;
