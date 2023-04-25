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

// Queries and Mutations
import {
	ADD_TODO,
	COMPLETE_UNCOMPLETE_TODO,
	DELETE_TODO,
	GET_INCOMPLETE_TODOS
} from '../../models/inboxitem'
import { ADD_LOG } from '../../models/log'

// Models
import InboxItem from '../../models/inboxitem'


interface ToDoListProps {
	setShowEditDialog: (show: boolean) => void;
	setToDoItem: (toDoItem: any) => void;
}

const ToDoList: React.FC<ToDoListProps> = ({ setShowEditDialog, setToDoItem }) => {
	const [toDoItems, setToDoItems] = useState<InboxItem[]>([]);
	const [newTodo, setNewTodo] = useState('');


	// Get all incomplete todos
	const { loading, error } = useQuery(GET_INCOMPLETE_TODOS, {
		onError: (error) => console.log(error.networkError),
		onCompleted: (data1) => {
			const toDoItemsData = data1.toDoItems.data
			const toDoItems = toDoItemsData.map((toDoItem: any) => {
				return new InboxItem({
					id: toDoItem.id,
					title: toDoItem.attributes.Title,
					completed: toDoItem.attributes.Completed,
					project: toDoItem.attributes.Project,
					dueDate: toDoItem.attributes.DueDate,
					description: toDoItem.attributes.Description,
					startDate: toDoItem.attributes.StartDate,
					startTime: toDoItem.attributes.StartTime
				})
			})
			setToDoItems(toDoItems)
		}
	})


	const [addTodo] = useMutation(ADD_TODO, {
		onError: (error) => console.log(error.networkError),
	});


	// Delete todo
	const [deleteTodo] = useMutation(DELETE_TODO, {
		onError: (error) => console.log(error.networkError),
	});
	const handleDelete = (id: string) => {
		deleteTodo({
			variables: { id },
		});
	};


	// Complete or uncomplete todo
	const [completeTodo] = useMutation(COMPLETE_UNCOMPLETE_TODO, {
		onError: (error) => console.log(error.networkError),
	});
	const [addLog] = useMutation(ADD_LOG, {
		onError: (error) => console.log(error.networkError),
	});
	const handleComplete = (e: React.MouseEvent<HTMLButtonElement>, toDoItem: InboxItem) => {
		e.stopPropagation();
		completeTodo({
			variables: {
				id: toDoItem.id,
				Completed: !toDoItem.completed
			},
		});
		addLog({
			variables: {
				Log: `Completed todo with id ${toDoItem.id}`,
				LogTime: new Date(),
				Type: 'todoitem',
			}
		});
	};


	const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setNewTodo(e.target.value);
	}, []);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		addTodo({
			variables: { Title: newTodo },
		});
		setNewTodo('');
	};


	const handleEdit = (toDoItem: InboxItem) => {
		setToDoItem(toDoItem);
		setShowEditDialog(true);
	};


	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error :(</p>;

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
						label="Add Todo"
						variant="outlined"
						value={newTodo}
						onChange={handleInputChange}
					/>
					<Button variant="contained" type="submit">
						Add
					</Button>
				</Box>


				<List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
					{toDoItems.map((item) => (
						<React.Fragment key={item.id}>
							<ListItem key={item.id} disablePadding>
								<ListItemButton onClick={() => handleEdit(item)}>
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
		</>
	);
}

export default ToDoList;