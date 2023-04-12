import React, { useState, useCallback } from 'react';
import './ToDoList.css';
import { useQuery, useMutation } from '@apollo/client';
import {
	Box,
	Button,
	Divider,
	IconButton,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemSecondaryAction,
	ListItemText,
	TextField
} from '@mui/material';

import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { ADD_TODO, COMPLETE_UNCOMPLETE_TODO, DELETE_TODO, GET_INCOMPLETE_TODOS } from './toDoItemQueries';



export default function ToDoList({ setShowEditDialog, setToDoItem }) {
	const [newTodo, setNewTodo] = useState('');

	const { loading, error, data } = useQuery(GET_INCOMPLETE_TODOS, {
		onCompleted: (data) => console.log(data),
	});

	const [addTodo] = useMutation(ADD_TODO, {
		onError: (error) => console.log(error.networkError),
	});

	const [deleteTodo] = useMutation(DELETE_TODO, {
		onError: (error) => console.log(error.networkError),
	});

	const [completeTodo] = useMutation(COMPLETE_UNCOMPLETE_TODO, {
		onError: (error) => console.log(error.networkError),
	});

	const handleInputChange = useCallback((e) => {
		setNewTodo(e.target.value);
	}, []);

	const handleSubmit = (e) => {
		e.preventDefault();
		addTodo({
			variables: { Title: newTodo },
		});
		setNewTodo('');
	};

	const handleDelete = (id) => {
		deleteTodo({
			variables: { id },
		});
	};

	const handleComplete = (id, completed, e) => {
		e.stopPropagation();
		completeTodo({
			variables: { id, Completed: completed },
		});
	};

	const handleEdit = (toDoItem) => {
		setToDoItem(toDoItem);
		console.log("to do list item ", toDoItem)
		setShowEditDialog(true);
	};

	console.log("reloading")


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
					{data?.toDoItems?.data?.map(({ id, attributes: { Title, Completed, DueDate, StartDate, Description } }) => (
						<React.Fragment key={id}>
							<ListItem key={id} disablePadding>
								<ListItemButton onClick={() => handleEdit({
									id,
									attributes: {
										Title,
										Completed,
										DueDate,
										StartDate,
										Description
									}
								})}>
									<ListItemIcon>
										<IconButton edge="start" aria-label="edit"
											onClick={(e) => handleComplete(id, !Completed, e)}>
											{Completed ? <CheckIcon /> : <CloseIcon />}
										</IconButton>
									</ListItemIcon>
									<ListItemText primary={Title} />
								</ListItemButton>
								<ListItemSecondaryAction>
									<IconButton edge="end" aria-label="delete" onClick={() => handleDelete(id)} className="delete-button">
										<DeleteIcon />
									</IconButton>
								</ListItemSecondaryAction>
							</ListItem>
							<Divider key={`divider-${id}`} />
						</React.Fragment>
					))}
				</List>

			</Box>
		</>
	);
}