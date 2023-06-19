import React, { useState, useCallback } from 'react';
import './ToDoList.css';
import { useQuery, useMutation } from '@apollo/client';
import {
	Box, Button, Divider,
	IconButton, List, ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemSecondaryAction,
	ListItemText, TextField
} from '@mui/material';

// Icons
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';

// Components
import EditInboxItemDialog from '../../components/EditToDoItemDialog';

// Queries and Mutations
import {
	ADD_TODO,
	CHECK_UNCHECK_TODO,
	DELETE_TODO,
	GET_INBOX_TODOS
} from '../../models/inboxitem'
import { ADD_LOG } from '../../models/log'

// Models
import InboxItem from '../../models/inboxitem'


const ToDoList: React.FC = () => {
	const [toDoItems, setToDoItems] = useState<InboxItem[]>([]);
	const [newTodo, setNewTodo] = useState('');
	const [selectedInboxItemId, setSelectedInboxItemId] = useState<string | null>(null);

	const handleClose = () => {
		setSelectedInboxItemId(null);
	};

	// Incomplete To Do Query
	const { loading, error } = useQuery(GET_INBOX_TODOS, {
		onError: (error) => console.log(error.networkError),
		onCompleted: (data) => {
			const toDoItems = data.toDoItemsWithoutProject.map((toDoItem: any) => {
				return new InboxItem({
					id: toDoItem.id,
					title: toDoItem.title,
					description: toDoItem.description,
					completed: toDoItem.completed,
					project: toDoItem.project,
					dueDateTime: toDoItem.dueDateTime,
					startDate: toDoItem.startDate,
					startTime: toDoItem.startTime,
					timeCompleted: toDoItem.timeCompleted,
				})
			})
			setToDoItems(toDoItems)
		}
	})


	// Add To Do
	const [addTodo] = useMutation(ADD_TODO, {
		refetchQueries: [{ query: GET_INBOX_TODOS }],
		onError: (error) => console.log(error.networkError),
	});


	// Delete todo
	const [deleteTodo] = useMutation(DELETE_TODO, {
		onError: (error) => console.log(error.networkError),
		refetchQueries: [{ query: GET_INBOX_TODOS }],
	});
	const handleDelete = (id: string) => {
		deleteTodo({
			variables: { id },
		});
	};


	// Complete or uncomplete todo
	const [completeTodo] = useMutation(CHECK_UNCHECK_TODO, {
		onError: (error) => console.log(error.networkError),
	});
	const [addLog] = useMutation(ADD_LOG, {
		refetchQueries: [{ query: GET_INBOX_TODOS }],
		onError: (error) => console.log(error.networkError),
	});
	const handleComplete = (e: React.MouseEvent<HTMLButtonElement>, toDoItem: InboxItem) => {
		e.stopPropagation();
		completeTodo({
			variables: {
				id: toDoItem.id,
				Completed: !toDoItem.completed
			},
		})
		addLog({
			variables: {
				todoItemId: toDoItem.id,
				logTime: new Date().toISOString(),
			}
		})
	}


	const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setNewTodo(e.target.value);
	}, [])

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		addTodo({
			variables: { title: newTodo },
		});
		setNewTodo('')
	}



	if (loading) return <p>Loading...</p>
	if (error) return <p>Error :(</p>

	return (
		<>
			<Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
				<Box
					component="form"
					sx={{
						"& > :not(style)": { m: 1, width: "25ch" },
					}}
					noValidate
					autoComplete="off"
					onSubmit={handleSubmit}
				>
					<TextField
						id="outlined-basic"
						label="Add To Do"
						variant="outlined"
						value={newTodo}
						onChange={handleInputChange}
						type="search"
					/>
					<Button variant="contained" type="submit">
						Add
					</Button>
				</Box>


				<List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
					{toDoItems.map((item) => (
						<React.Fragment key={item.id}>
							<ListItem key={item.id} disablePadding>
								<ListItemButton onClick={() => setSelectedInboxItemId(item.id)}>
									<ListItemIcon>
										<IconButton edge="start" aria-label="edit"
											onClick={(e) => handleComplete(e, item)}>
											{item.completed ? <CheckIcon /> : <CloseIcon />}
										</IconButton>
									</ListItemIcon>
									<ListItemText primary={item.title} />
								</ListItemButton>
								<ListItemSecondaryAction>
									<IconButton edge="end" aria-label="delete" onClick={() => handleDelete(item.id)} className="delete-button">
										<DeleteIcon />
									</IconButton>
								</ListItemSecondaryAction>
							</ListItem>
							<Divider key={`divider-${item.id}`} />
						</React.Fragment>
					))}
				</List>

			</Box >

			{/* Edit To Do Item Dialog */}
			{selectedInboxItemId && <EditInboxItemDialog handleClose={handleClose} inboxItemId={selectedInboxItemId} />}

		</>
	);
}

export default ToDoList;