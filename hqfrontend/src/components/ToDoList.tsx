import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
	Box,
	Button,
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
import { ADD_TODO, COMPLETE_UNCOMPLETE_TODO, DELETE_TODO, GET_TODOS } from './todolistqueries';


interface ToDoItem {
	id: string;
	attributes: {
		Title: string;
		Completed: boolean;
	};
}

interface ToDoListData {
	toDoInboxes: {
		data: ToDoItem[];
	};
}

interface AddToDoData {
	createToDoInbox: {
		toDoInbox: ToDoItem;
	};
}

interface DeleteToDoData {
	deleteToDoInbox: {
		data: ToDoItem;
	};
}




export default function ToDoList(): JSX.Element {
	const { loading, error, data, refetch } = useQuery<ToDoListData>(GET_TODOS);
	const [newTodo, setNewTodo] = useState<string>('');
	const [addTodo] = useMutation<AddToDoData>(ADD_TODO, {
		onCompleted: () => refetch(),
		onError: (error) => console.log(error.networkError),
	});
	const [deleteTodo] = useMutation<DeleteToDoData>(DELETE_TODO, {
		onCompleted: () => refetch(),
		onError: (error) => console.log(error.networkError),
	});
	const [completeTodo] = useMutation<AddToDoData>(COMPLETE_UNCOMPLETE_TODO, {
		onCompleted: () => refetch(),
		onError: (error) => console.log(error.networkError),
	});

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
		e.preventDefault();
		addTodo({
			variables: { Title: newTodo },
		});
		setNewTodo('');
	};

	const handleDelete = (id: string): void => {
		deleteTodo({
			variables: { id },
		});
	};

	const handleComplete = (id: string, completed: boolean): void => {
		completeTodo({
			variables: { id, Completed: completed },
		});
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
						onChange={(e) => setNewTodo(e.target.value)}
					/>
					<Button variant="contained" type="submit">
						Add
					</Button>
				</Box>
				<List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
					{data?.toDoInboxes?.data?.map(({ id, attributes: { Title, Completed } }: ToDoItem) => (
						<ListItem key={id} disablePadding>
							<ListItemButton onClick={() => handleComplete(id, !Completed)}>
								<ListItemIcon>{Completed ? <CheckIcon /> : <CloseIcon />}</ListItemIcon>
								<ListItemText primary={Title} />
							</ListItemButton>
							<ListItemSecondaryAction>
								<IconButton edge="end" aria-label="delete" onClick={() => handleDelete(id)}>
									<DeleteIcon />
								</IconButton>
							</ListItemSecondaryAction>
						</ListItem>
					))}
				</List>
			</Box>
		</>
	);
}