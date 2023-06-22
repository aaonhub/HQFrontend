import { useEffect } from 'react';
import {
	Container,
	Typography,
	Box,
	Paper,
} from '@mui/material';

// Components
import ToDoList from './ToDoList';



const InboxPage = () => {
	// Tab Title
	useEffect(() => {
		document.title = "Inbox - HQ";
	}, []);


	return (
		<Container maxWidth="xl">


			<Box mt={4} mb={4}>
				<Paper elevation={3} style={{ padding: "2rem" }}>
					<Typography variant="h4" align="center" gutterBottom>
						Inbox
					</Typography>
					<Typography variant="subtitle1" align="center">
						Manage your tasks
					</Typography>
				</Paper>
			</Box>


			{/* To Do List */}
			<Paper elevation={3} style={{ padding: "2rem" }}>
				<ToDoList />
			</Paper>


		</Container>
	);
};

export default InboxPage;
