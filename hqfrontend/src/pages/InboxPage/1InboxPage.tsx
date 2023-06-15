import {
	Container,
	Typography,
	Box,
	Paper,
} from '@mui/material';

// Components
import ToDoList from './ToDoList';



const InboxPage = () => {


	return (
		<Container maxWidth="md">


			<Box mt={4} mb={4}>
				<Typography variant="h4" align="center" gutterBottom>
					Inbox
				</Typography>
				<Typography variant="subtitle1" align="center">
					Manage your tasks
				</Typography>
			</Box>


			{/* To Do List */}
			<Paper elevation={2}>
				<ToDoList />
			</Paper>


		</Container>
	);
};

export default InboxPage;
