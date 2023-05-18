import { useEffect, useState } from 'react'
import { Box, CssBaseline, Divider } from '@mui/material'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import ListAltIcon from '@mui/icons-material/ListAlt'
import { Link } from 'react-router-dom'
import ThemeProvider from '../SettingsPage/ThemeContext'
import { gql, useMutation } from '@apollo/client'
import { Analytics } from '@vercel/analytics/react';
import Sidebar from './Sidebar'

// Icons
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import InboxIcon from '@mui/icons-material/MoveToInbox'
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle'
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment'
import SubjectIcon from '@mui/icons-material/Subject'
import SettingsIcon from '@mui/icons-material/Settings'
import BookIcon from '@mui/icons-material/Book'

// Pages
import HabitsPage from '../HabitsPage/1HabitsPage'
import InboxPage from '../InboxPage/1InboxPage'
import TodayPage from '../TodayPage/1TodayPage'
import Test from '../Test/testpage'
import LogPage from '../LogPage/LogPage'
import RitualsPage from '../RitualsPage/1RitualsPage'
import ProjectsListPage from '../ProjectsPage/1ListProjectsPage'
import ProjectPage from '../ProjectsPage/1ProjectPage'
import HelpIcon from '@mui/icons-material/Help'
import HelpPage from '../HelpPage/HelpPage'
import SettingsPage from '../SettingsPage/SettingsPage'
import LoginPage from '../LoginPage/LoginPage'
import RegistrationPage from '../RegistrationPage/RegistrationPage'
import DemoPage from '../DemoPage/DemoPage'
import DailyReviewPage from '../DailyReviewPage/1DailyReviewPage'
import ProfilePage from '../ProfilePage/ProfilePage'


const REFRESH_TOKEN_MUTATION = gql`
	mutation refreshToken {
		refreshToken {
			payload
		}
	}
`

const DELETE_REFRESH_TOEKN_MUTATION = gql`
	mutation {
		deleteRefreshTokenCookie{
			deleted
		}
	}
`


function getAuth() {
	let jwtToken = localStorage.getItem("loggedIn");
	return jwtToken;
}


function RequireAuth({ children }: any) {
	let isAuthenticated = getAuth()
	return isAuthenticated ? children : <Navigate to={"/login"} />
}


function App(): JSX.Element {

	const [loggedIn, setLoggedIn] = useState(localStorage.getItem("loggedIn"))
	const [showSidebar, onSetShowSidebar] = useState(false)


	const [deleteRefreshTokenCookie] = useMutation(DELETE_REFRESH_TOEKN_MUTATION, {
		onCompleted: () => {
			setLoggedIn("false")
			localStorage.removeItem('loggedIn')
		}
	})

	// Refresh Mutation with onerror
	const [refreshToken] = useMutation(REFRESH_TOKEN_MUTATION, {
		onError: () => {
			setLoggedIn("false")
			localStorage.removeItem('loggedIn')
			localStorage.removeItem('username')
		},
		onCompleted: (data) => {
			setLoggedIn("true")
			localStorage.setItem('loggedIn', "true")
			localStorage.setItem('username', data.refreshToken.payload.username)
		}
	})
	useEffect(() => {
		// Run refresh token mutation every 4 minutes
		refreshToken()
		setInterval(() => {
			refreshToken()
			console.log("Refresh on interval")
		}, 25 * 60 * 1000)
		console.log("Refresh")
	}, [refreshToken])


	// logout
	const handleLogout = () => {
		deleteRefreshTokenCookie()
	}



	const drawer = (
		<Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>


			<Box sx={{ flexGrow: 1 }} />
			<List>
				{loggedIn === "true" &&
					<ListItem key={"LogOut"} disablePadding>
						<ListItemButton onClick={handleLogout}>
							<ListItemIcon>
								<SettingsIcon />
							</ListItemIcon>
							<ListItemText primary={"Log Out"} />
						</ListItemButton>
					</ListItem>
				}
				<ListItem key={"Profile"} disablePadding>
					<ListItemButton component={Link} to="/profile">
						<ListItemIcon>
							<SettingsIcon />
						</ListItemIcon>
						<ListItemText primary={"Profile"} />
					</ListItemButton>
				</ListItem>
			</List>
		</Box>
	);


	return (
		<ThemeProvider>
			<Router>
				<Box sx={{ display: 'flex' }}>
					<Analytics />
					<CssBaseline />


					{/* Sidebar */}
					<Box sx={{
						width: !showSidebar ? 240 : 56, // Adjust the width based on the value of `showSidebar`
						transition: 'width 0.2s',
					}}>
						<Sidebar
							onSidebarHide={() => {
								onSetShowSidebar(false)
							}}
							showSidebar={showSidebar}
						/>
					</Box>

					{/* Content */}
					<Box sx={{ flexGrow: 1 }}>
						<Box sx={{ p: 3 }}>
							<Routes>
								<Route path="/" element={<RequireAuth redirectTo="/login" then="/">
									<TodayPage />
								</RequireAuth>} />
								<Route path="/log" element={<RequireAuth>
									<LogPage />
								</RequireAuth>} />
								<Route path="/inbox" element={<RequireAuth>
									<InboxPage />
								</RequireAuth>} />
								<Route path="/habits" element={<RequireAuth>
									<HabitsPage />
								</RequireAuth>} />
								<Route path="/rituals" element={<RequireAuth>
									<RitualsPage />
								</RequireAuth>} />
								<Route path="/projects" element={<RequireAuth>
									<ProjectsListPage />
								</RequireAuth>} />
								<Route path="/project/:projectId" element={<RequireAuth>
									<ProjectPage />
								</RequireAuth>} />
								<Route path="/dailyreview" element={<RequireAuth>
									<DailyReviewPage />
								</RequireAuth>} />
								<Route path="/settings" element={<RequireAuth>
									<SettingsPage />
								</RequireAuth>} />
								<Route path="/profile" element={<RequireAuth>
									<ProfilePage />
								</RequireAuth>} />


								<Route path="/help" element={<HelpPage />} />
								<Route path="/test" element={<Test />} />
								<Route path="/demo" element={<DemoPage />} />

								<Route path="/login" element={<LoginPage />} />
								<Route path="/register" element={<RegistrationPage />} />
							</Routes>
						</Box>
					</Box>
				</Box>
			</Router>
		</ThemeProvider>
	);
}

export default App;
