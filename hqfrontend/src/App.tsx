import { useEffect, useState } from 'react'
import { Box, CssBaseline, Divider } from '@mui/material'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import AppBar from '@mui/material/AppBar'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import ListAltIcon from '@mui/icons-material/ListAlt'
import { Link } from 'react-router-dom'
import ThemeProvider from './pages/SettingsPage/ThemeContext'
import { gql, useMutation } from '@apollo/client'

// Icons
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import InboxIcon from '@mui/icons-material/MoveToInbox'
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle'
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment'
import SubjectIcon from '@mui/icons-material/Subject'
import SettingsIcon from '@mui/icons-material/Settings'
import BookIcon from '@mui/icons-material/Book'

// Pages
import HabitsPage from './pages/HabitsPage/1HabitsPage'
import InboxPage from './pages/InboxPage/1InboxPage'
import TodayPage from './pages/TodayPage/1TodayPage'
import Test from './pages/testpage'
import LogPage from './pages/LogPage/LogPage'
import RitualsPage from './pages/RitualsPage/1RitualsPage'
import ProjectsListPage from './pages/ProjectsPage/1ListProjectsPage'
import ProjectPage from './pages/ProjectsPage/1ProjectPage'
import HelpIcon from '@mui/icons-material/Help'
import HelpPage from './pages/HelpPage/HelpPage'
import SettingsPage from './pages/SettingsPage/SettingsPage'
import LoginPage from './pages/LoginPage/LoginPage'
import RegistrationPage from './pages/RegistrationPage/RegistrationPage'
import DemoPage from './pages/DemoPage/DemoPage'
import DailyReviewPage from './pages/DailyReviewPage/1DailyReviewPage'
import ProfilePage from './pages/ProfilePage/ProfilePage'


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

const drawerWidth = 240;


function getAuth() {
	let jwtToken = localStorage.getItem("loggedIn");
	return jwtToken;
}


function RequireAuth({ children }: any) {
	let isAuthenticated = getAuth()
	return isAuthenticated ? children : <Navigate to={"/login"} />
}


function App(): JSX.Element {

	const [mobileOpen, setMobileOpen] = useState(false)
	const [loggedIn, setLoggedIn] = useState(localStorage.getItem("loggedIn"))


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
		},
		onCompleted: () => {
			setLoggedIn("true")
			localStorage.setItem('loggedIn', "true")
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




	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	};

	const drawer = (
		<Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
			<Divider />
			<List>
				<ListItem key={"Today"} disablePadding>
					<ListItemButton component={Link} to="/">
						<ListItemIcon>
							<CalendarTodayIcon />
						</ListItemIcon>
						<ListItemText primary={"Today"} />
					</ListItemButton>
				</ListItem>
				<ListItem key={"Log"} disablePadding>
					<ListItemButton component={Link} to="/log">
						<ListItemIcon>
							<SubjectIcon />
						</ListItemIcon>
						<ListItemText primary={"Log"} />
					</ListItemButton>
				</ListItem>
			</List>

			<Divider />

			<List>
				<ListItem key={"Inbox"} disablePadding>
					<ListItemButton component={Link} to="/inbox">
						<ListItemIcon>
							<InboxIcon />
						</ListItemIcon>
						<ListItemText primary={"Inbox"} />
					</ListItemButton>
				</ListItem>
				<ListItem key={"Projects"} disablePadding>
					<ListItemButton component={Link} to="/projects">
						<ListItemIcon>
							<ListAltIcon />
						</ListItemIcon>
						<ListItemText primary={"Projects"} />
					</ListItemButton>
				</ListItem>
				<ListItem key={"Habits"} disablePadding>
					<ListItemButton component={Link} to="/habits">
						<ListItemIcon>
							<ChangeCircleIcon />
						</ListItemIcon>
						<ListItemText primary={"Habits"} />
					</ListItemButton>
				</ListItem>
				<ListItem key={"Rituals"} disablePadding>
					<ListItemButton component={Link} to="/rituals">
						<ListItemIcon>
							<LocalFireDepartmentIcon />
						</ListItemIcon>
						<ListItemText primary={"Rituals"} />
					</ListItemButton>
				</ListItem>
				<ListItem key={"DailyReviews"} disablePadding>
					<ListItemButton component={Link} to="/dailyreview">
						<ListItemIcon>
							<BookIcon />
						</ListItemIcon>
						<ListItemText primary={"Reviews"} />
					</ListItemButton>
				</ListItem>
			</List>

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
				<ListItem key={"Settings"} disablePadding>
					<ListItemButton component={Link} to="/settings">
						<ListItemIcon>
							<SettingsIcon />
						</ListItemIcon>
						<ListItemText primary={"Settings"} />
					</ListItemButton>
				</ListItem>
				<ListItem key={"Help"} disablePadding>
					<ListItemButton component={Link} to="/help">
						<ListItemIcon>
							<HelpIcon />
						</ListItemIcon>
						<ListItemText primary={"Help"} />
					</ListItemButton>
				</ListItem>
			</List>
		</Box>
	);

	const container = window !== undefined ? window.document.body : undefined;

	return (
		<ThemeProvider>
			<Router>
				<Box sx={{ display: 'flex' }}>
					<CssBaseline />
					<AppBar
						position="fixed"
						sx={{
							width: { sm: `calc(100% - ${drawerWidth}px)` },
							ml: { sm: `${drawerWidth}px` },
						}}
					>
					</AppBar>
					<Box
						component="nav"
						sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
						aria-label="mailbox folders"
					>
						{/* The implementation can be swapped with js to avoid SEO duplication of links. */}
						<Drawer
							container={container}
							variant="temporary"
							open={mobileOpen}
							onClose={handleDrawerToggle}
							ModalProps={{
								keepMounted: true, // Better open performance on mobile.
							}}
							sx={{
								display: { xs: 'block', sm: 'none' },
								'& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
							}}
						>
							{drawer}
						</Drawer>
						<Drawer
							variant="permanent"
							sx={{
								display: { xs: 'none', sm: 'block' },
								'& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
							}}
							open
						>
							{drawer}
						</Drawer>
					</Box>
					<Box
						component="main"
						sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
					>
						<Box component="main" sx={{ flexGrow: 1, marginLeft: { sm: "0" } }}>
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
