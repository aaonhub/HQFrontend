import React, { useState } from 'react';
import {
	Container,
	Typography,
	Box,
	Paper,
	Fab,
	styled,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditToDoItemDialog from './EditToDoItemDialog';
import ToDoList from './ToDoList';


const StyledFab = styled(Fab)({
	position: 'fixed',
	bottom: 16,
	right: 16,
});

const InboxPage = () => {
	const [showEditDialog, setShowEditDialog] = useState(false);
	const [toDoItem, setToDoItem] = useState({
		id: '',
		attributes: {
			Title: '',
			Completed: false,
			DueDate: '',
			StartDate: '',
			Description: '',
		},
	});

	const handleAddClick = () => {
	};

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
				<ToDoList setShowEditDialog={setShowEditDialog} setToDoItem={setToDoItem} />
			</Paper>

			{/* Bottom Right Add Button */}
			<StyledFab color="primary" aria-label="add" onClick={handleAddClick}>
				<AddIcon />
			</StyledFab>

			{/* Edit To Do Item Dialog */}
			<EditToDoItemDialog
				showEditDialog={showEditDialog}
				setShowEditDialog={setShowEditDialog}
				toDoItem={toDoItem}
			/>

		</Container>
	);
};

export default InboxPage;
