import { useCallback, useEffect, useRef, useState } from 'react'
import { Alert, Box, CssBaseline, Snackbar } from '@mui/material'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './Sidebar'

// Globals
import { useGlobalContext } from '../App/GlobalContextProvider';

// Queries
import { GET_SETTINGS } from '../../models/settings';

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
import ProjectsListPage from '../ListProjectsPage/ListProjectsPage'
import ProjectPage from '../ProjectPage/ProjectPage'
import HelpPage from '../HelpPage/HelpPage'
import SettingsPage from '../SettingsPage/SettingsPage'
import LoginPage from '../LoginPage/LoginPage'
import RegistrationPage from '../RegistrationPage/RegistrationPage'
import DemoPage from '../DemoPage/DemoPage'
import DailyReviewPage from '../DailyReviewPage/1DailyReviewPage'
import ProfilePage from '../ProfilePage/ProfilePage'
import AccountabilityPage from '../AccountabilityPage/1AccountabilityPage'
import ToDosPage from '../ToDosPage/ToDosPage';
import PlanningPage from '../PlanningPage/PlanningPage'
import MaintenancePage from '../MaintenancePage/MaintenancePage'

import { useAuth } from './auth';
import CommandLine from './CommandLine';
import DebugPanel from './DebugPanel'
import { useQuery } from '@apollo/client'

// Models
import SettingsObject from '../../models/settings'




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
	const { setLoggedIn, setGlobalProfile, debugPanelVisible, settings, setSettings } = useGlobalContext();

	useAuth(setLoggedIn, setGlobalProfile);

	// Settings
	const { loading, error, data } = useQuery(GET_SETTINGS, {
		onCompleted: (data) => {
			new SettingsObject({
				habitOrder: data.settings.habitOrder,
				hiddenSidebarItems: data.settings.hiddenSidebarItems,
				id: data.settings.id,
				itineraryOrder: data.settings.itineraryOrder,
				owner: data.settings.owner,
				projectOrder: data.settings.projectOrder,
				masterListOrder: JSON.parse(data.settings.masterListOrder),
				stickyNote: data.settings.stickyNote,
				theme: data.settings.theme,
				__typename: data.settings.__typename
			})

			setSettings(data.settings)
		},
		onError: (error) => {
			console.log(error);
		}
	});



	// Command Line Stuff
	const [showCommandLine, setShowCommandLine] = useState(false);
	const [isControlPressed, setIsControlPressed] = useState(false);
	const [timestamp, setTimestamp] = useState(0);
	const commandInputRef = useRef<HTMLInputElement>(null);
	const handleKeyPress = useCallback((event: KeyboardEvent) => {
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
		<Router>
			<Box sx={{ display: 'flex', overflow: 'hidden' }}>
				<CssBaseline />

				{/* Sidebar */}
				<Box sx={{
					width: '240px', // Specify a fixed width for the sidebar
					transition: 'width 0.2s',
					flexShrink: 0, // Prevents the sidebar from shrinking
					height: '100vh', // Make the sidebar full height
					position: 'fixed', // Fix sidebar's position relative to the viewport
				}}>
					<Sidebar />
				</Box>

				{/* Content */}
				<Box sx={{
					flexGrow: 1,
					flexShrink: 1,
					overflow: 'auto',
					paddingLeft: '240px', // Ensure this matches the sidebar's width
					width: `calc(100% - 240px)`,
				}}> {/* Add overflow: 'auto' */}
					<Box sx={{ p: 3 }}>
						<ContentRoutes />
					</Box>
				</Box>

				{/* Snackbar */}
				<SnackbarComponent />

				{/* Constant Input at Bottom */}
				{showCommandLine &&
					<CommandLine setShowCommandLine={setShowCommandLine} commandInputRef={commandInputRef} />
				}
			</Box>
			{debugPanelVisible && <DebugPanel />}
		</Router>
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
			<Route path="/plan" element={<RequireAuth>
				<PlanningPage />
			</RequireAuth>} />
			<Route path="/maintenance" element={<RequireAuth>
				<MaintenancePage />
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
			<Alert onClose={handleSnackbarClose} severity={snackbar.severity} variant="filled">
				{snackbar.message}
			</Alert>
		</Snackbar>
	);
}

export default App;
