import { Box, CssBaseline, Divider } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "./App.css";
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { Link } from 'react-router-dom';

import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import SubjectIcon from '@mui/icons-material/Subject';
import SettingsIcon from '@mui/icons-material/Settings';

import ThemeProvider from './pages/SettingsPage/ThemeContext';

import HabitsPage from './pages/HabitsPage/HabitsPage';
import InboxPage from './pages/InboxPage/InboxPage';
import MainView from './pages/MainView/MainView';
import Test from './pages/testpage';
import LogPage from './pages/LogPage/LogPage';
import RitualsPage from './pages/RitualsPage/RitualsPage';
import ProjectsPage from './pages/ProjectsPage/ProjectsPage';
import HelpIcon from '@mui/icons-material/Help';
import HelpPage from './pages/HelpPage/HelpPage';
import SettingsPage from './pages/SettingsPage/SettingsPage';
import LoginPage from './pages/LoginPage/LoginPage';
import RegistrationPage from './pages/RegistrationPage/RegistrationPage';

const drawerWidth = 240;

function App({ window }) {
	const [mobileOpen, setMobileOpen] = React.useState(false);

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
			</List>

			<Box sx={{ flexGrow: 1 }} />
			<List>
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

	const container = window !== undefined ? () => window().document.body : undefined;

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
								<Route path="/" element={<MainView />} />
								<Route path="/log" element={<LogPage />} />
								<Route path="/inbox" element={<InboxPage />} />
								<Route path="/habits" element={<HabitsPage />} />
								<Route path="/rituals" element={<RitualsPage />} />
								<Route path="/projects" element={<ProjectsPage />} />
								<Route path="/help" element={<HelpPage />} />
								<Route path="/settings" element={<SettingsPage />} />
								<Route path="test" element={<Test />} />
								<Route path="login" element={<LoginPage />} />
								<Route path="register" element={<RegistrationPage />} />
							</Routes>
						</Box>

					</Box>
				</Box>
			</Router>
		</ThemeProvider>
	);
}

export default App;
