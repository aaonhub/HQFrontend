import React, { useEffect } from 'react';
import { Container, Typography, Box, Paper, useTheme } from '@mui/material';

// Components
import ToDoList from './ToDoList';

const InboxPage = () => {
	const theme = useTheme();

	useEffect(() => {
		document.title = "Inbox - HQ";
	}, []);

	return (
		<Container maxWidth="xl" style={{ display: 'flex' }}>

			{/* Main Content Area */}
			<Box flex={1} mt={4} mb={4} style={{ paddingRight: '20%' }}>
				<Typography variant="h4" align="left" gutterBottom>
					Inbox
				</Typography>

				<ToDoList />
			</Box>

			{/* Right Side - Fixed Position */}
			<Box style={{ position: 'fixed', right: 0, top: 0, height: '100%', width: '20%', display: 'flex', flexDirection: 'column' }}>
				{/* Someday */}
				<Paper elevation={3} style={{ backgroundColor: theme.palette.secondary.main, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
					<Typography variant="h5" align="center" gutterBottom style={{ color: theme.palette.secondary.contrastText }}>
						Someday
					</Typography>
				</Paper>

				{/* Master List */}
				<Paper elevation={3} style={{ backgroundColor: theme.palette.primary.main, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
					<Typography variant="h5" align="center" gutterBottom style={{ color: theme.palette.primary.contrastText }}>
						Master List
					</Typography>
				</Paper>

				{/* Project */}
				<Paper elevation={3} style={{ backgroundColor: theme.palette.background.paper, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
					<Typography variant="h5" align="center" gutterBottom style={{ color: theme.palette.text.primary }}>
						Project
					</Typography>
				</Paper>
			</Box>
		</Container>
	);
};

export default InboxPage;
