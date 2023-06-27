import { useCallback, useEffect, useRef, useState } from 'react'
import { Alert, Box, CssBaseline, Snackbar } from '@mui/material'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import ThemeProvider from '../SettingsPage/ThemeContext'
import { Analytics } from '@vercel/analytics/react';
import Sidebar from './Sidebar'
import './App.css'

// Globals
import { useGlobalContext } from '../App/GlobalContextProvider';

// Icons
// import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
// import InboxIcon from '@mui/icons-material/MoveToInbox'
// import ChangeCircleIcon from '@mui/icons-material/ChangeCircle'
// import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment'
// import SubjectIcon from '@mui/icons-material/Subject'
// import SettingsIcon from '@mui/icons-material/Settings'
// import BookIcon from '@mui/icons-material/Book'
// import HelpIcon from '@mui/icons-material/Help'

// Pages
import HabitsPage from '../HabitsPage/1HabitsPage'
import InboxPage from '../InboxPage/1InboxPage'
import TodayPage from '../TodayPage/1TodayPage'
import Test from '../Test/testpage'
import LogPage from '../LogPage/LogPage'
import RitualsPage from '../RitualsPage/1RitualsPage'
import ProjectsListPage from '../ProjectsPage/1ListProjectsPage'
import ProjectPage from '../ProjectsPage/1ProjectPage'
import HelpPage from '../HelpPage/HelpPage'
import SettingsPage from '../SettingsPage/SettingsPage'
import LoginPage from '../LoginPage/LoginPage'
import RegistrationPage from '../RegistrationPage/RegistrationPage'
import DemoPage from '../DemoPage/DemoPage'
import DailyReviewPage from '../DailyReviewPage/1DailyReviewPage'
import ProfilePage from '../ProfilePage/ProfilePage'
import AccountabilityPage from '../AccountabilityPage/1AccountabilityPage'
import ToDosPage from '../ToDosPage/ToDosPage';
import { useAuth } from './auth';
import CommandLine from './CommandLine';




// Login Required Routes
function getAuth() {
	let jwtToken = localStorage.getItem("loggedIn");
	return jwtToken;
}
function RequireAuth({ children }: any) {
	let isAuthenticated = getAuth()
	return isAuthenticated ? children : <Navigate to={"/login"} />
}



function App(): JSX.Element {
	const { setLoggedIn, setGlobalProfile } = useGlobalContext();
	const [showSidebar, onSetShowSidebar] = useState(false);

	useAuth(setLoggedIn, setGlobalProfile);


	// Command Line Stuff
	const [showCommandLine, setShowCommandLine] = useState(false);
	const [isControlPressed, setIsControlPressed] = useState(false);
	const [timestamp, setTimestamp] = useState(0);
	const commandInputRef = useRef<HTMLInputElement>(null);
	const handleKeyPress = useCallback((event: KeyboardEvent) => {
		console.log(event.key)
		if ((event.key === 'Control' || event.key === "Escape") && !event.repeat) {

			if (isControlPressed && (Date.now() - timestamp < 300)) { // 300 ms as threshold
				setShowCommandLine(!showCommandLine);
				commandInputRef.current?.focus();
			}
			setIsControlPressed(true);
			setTimestamp(Date.now());
		}
	}, [isControlPressed, timestamp, showCommandLine]);
	useEffect(() => {
		// attach the event listener
		document.addEventListener('keydown', handleKeyPress);

		// remove the event listener
		return () => {
			document.removeEventListener('keydown', handleKeyPress);
		};
	}, [handleKeyPress]);


	return (
		<ThemeProvider>
			<Router>
				<Box sx={{ display: 'flex', overflow: 'hidden' }}> {/* Add this here */}
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
						<Box sx={{ p: 3, paddingBottom: "128px" }}>
							<ContentRoutes />
						</Box>

						{/* Snackbar */}
						<SnackbarComponent />

					</Box>


					{/* Constant Input at Bottom */}
					{showCommandLine &&
						<CommandLine setShowCommandLine={setShowCommandLine} commandInputRef={commandInputRef} />
					}


				</Box>
			</Router>
		</ThemeProvider>
	);
}


function ContentRoutes(): JSX.Element {
	return (
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
			<Route path="/accountability" element={<RequireAuth>
				<AccountabilityPage />
			</RequireAuth>} />
			<Route path="/todos" element={<RequireAuth>
				<ToDosPage />
			</RequireAuth>} />


			<Route path="/help" element={<HelpPage />} />
			<Route path="/test" element={<Test />} />
			<Route path="/demo" element={<DemoPage />} />

			<Route path="/login" element={<LoginPage />} />
			<Route path="/register" element={<RegistrationPage />} />
		</Routes>
	);
}

function SnackbarComponent(): JSX.Element {
	const { snackbar, setSnackbar } = useGlobalContext();

	const handleSnackbarClose = () => {
		setSnackbar({
			...snackbar,
			open: false
		})
	}

	return (
		<Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleSnackbarClose}>
			<Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
				{snackbar.message}
			</Alert>
		</Snackbar>
	);
}

export default App;
