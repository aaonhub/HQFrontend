import {
	useContext,
	// useContext, 
	useEffect, useState
} from 'react';
import { ThemeContext } from './ThemeContext';
import {
	FormControl, InputLabel, MenuItem, Select, 
	TextField, Box, Typography, Button, Divider
} from '@mui/material';
import { useMutation, gql } from '@apollo/client';

// Globals
import { useGlobalContext } from '../App/GlobalContextProvider';

// Queries and Mutations
import { CHANGE_CODENAME } from '../../models/social';
import SidebarSettings from './SidebarSettings';


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

	const { currentTheme, setTheme } = useContext(ThemeContext);
	const { setLoggedIn, globalProfile, setGlobalProfile, setSnackbar } = useGlobalContext()
	const [codeName, setCodeName] = useState<string>(globalProfile.codename || '');
	const [refreshTokenDeleted, setRefreshTokenDeleted] = useState<boolean>(false);
	const [tokenDeleted, setTokenDeleted] = useState<boolean>(false);



	useEffect(() => {
		setCodeName(globalProfile.codename || '');
	}, [globalProfile]);



	// Logout
	const [deleteRefreshTokenCookie] = useMutation(DELETE_REFRESH_TOEKN_MUTATION, {
		onCompleted: () => {
			setLoggedIn(false)
			localStorage.removeItem('loggedIn')
			setRefreshTokenDeleted(true)
		}
	})
	const [deleteTokenCookie] = useMutation(DELETE_TOKEN_MUTATION, {
		onCompleted: () => {
			setLoggedIn(false)
			localStorage.removeItem('loggedIn')
			setTokenDeleted(true)
		}
	})
	const handleLogout = () => {
		setGlobalProfile({})
		deleteRefreshTokenCookie()
		deleteTokenCookie()
	}
	useEffect(() => {
		if (refreshTokenDeleted && tokenDeleted) {
			window.location.reload()
		}
	}, [refreshTokenDeleted, tokenDeleted])

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

	const handleChange = (event: any) => {
		setTheme(event.target.value);
	};

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

			<Divider />

			{/* Set Theme */}
			<Box mb={2}>
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
			</Box>

			<Box mb={2}>
				<Box mt={2}>
					<Typography variant="h5">Sidebar</Typography>
				</Box>
				<SidebarSettings />
			</Box>

			<Divider />

			{/* Set Codename */}
			<Box mt={2}>
				<Typography variant="h5">Set Codename</Typography>
				<Box mt={2}>
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
				</Box>

				<Box mt={2} mb={2}>
					<Button
						variant="contained"
						color="primary"
						disabled={codeName === globalProfile.codename}
						onClick={handleChangeCodeName}
					>
						Change Codename
					</Button>
				</Box>
			</Box>

			<Divider />


			{/* Logout */}
			<Box mt={2}>
				<Button variant="contained" color="error" onClick={handleLogout}>Logout</Button>
			</Box>

		</Box>
	);
};

export default SettingsPage;
