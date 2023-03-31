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
import { ToDoItem } from './InboxPage';


interface ToDoListData {
	toDoItems: {
		data: ToDoItem[];
	};
}

interface AddToDoData {
	createToDoItem: {
		createToDoItem: ToDoItem;
	};
}

interface DeleteToDoData {
	createToDoItem: {
		data: ToDoItem;
	};
}


//add props
interface Props {
	setShowEditDialog: React.Dispatch<React.SetStateAction<boolean>>;
	setToDoItem: React.Dispatch<React.SetStateAction<ToDoItem>>;
}


export default function ToDoList(props: Props): JSX.Element {
	const { setShowEditDialog, setToDoItem } = props;
	const [newTodo, setNewTodo] = useState<string>('');

	const { loading, error, data } = useQuery<ToDoListData>(GET_INCOMPLETE_TODOS,{
		onCompleted: (data) => console.log(data),
	});
	
	const [addTodo] = useMutation<AddToDoData>(ADD_TODO, {
		onError: (error) => console.log(error.networkError),
	});

	const [deleteTodo] = useMutation<DeleteToDoData>(DELETE_TODO, {
		onError: (error) => console.log(error.networkError),
	});

	const [completeTodo] = useMutation<AddToDoData>(COMPLETE_UNCOMPLETE_TODO, {
		onError: (error) => console.log(error.networkError),
	});

	const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setNewTodo(e.target.value);
	}, []);

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

	const handleComplete = (id: string, completed: boolean, e: React.MouseEvent): void => {
		e.stopPropagation();
		completeTodo({
			variables: { id, Completed: completed },
		});
	};

	const handleEdit = (toDoItem: ToDoItem): void => {
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
					{data?.toDoItems?.data?.map(({ id, attributes: { Title, Completed, DueDate, StartDate, Description } }: ToDoItem) => (
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