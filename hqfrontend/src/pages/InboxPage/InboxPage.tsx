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

interface Props {
	// add any props here
}

export interface ToDoItem {
	id: string;
	attributes: {
		Title: string;
		Completed: boolean;
		DueDate: string;
		StartDate: string;
		Description: string;
	};
}

const StyledFab = styled(Fab)({
	position: 'fixed',
	bottom: 16,
	right: 16,
});

const InboxPage: React.FC<Props> = (props: Props) => {
	const [showEditDialog, setShowEditDialog] = useState<boolean>(false);
	const [toDoItem, setToDoItem] = useState<ToDoItem>({
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
		setShowEditDialog(true);
		setToDoItem({
			id: '',
			attributes: {
				Title: '',
				Completed: false,
				DueDate: '',
				StartDate: '',
				Description: '',
			},
		});
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
			<Paper elevation={2}>
				<ToDoList
					setShowEditDialog={setShowEditDialog}
					setToDoItem={setToDoItem}
				/>
			</Paper>
			<StyledFab color="primary" aria-label="add" onClick={handleAddClick}>
				<AddIcon />
			</StyledFab>
			<EditToDoItemDialog
				showEditDialog={showEditDialog}
				setShowEditDialog={setShowEditDialog}
				toDoItem={toDoItem}
				setToDoItem={setToDoItem}
			/>
		</Container>
	);
};

export default InboxPage;
