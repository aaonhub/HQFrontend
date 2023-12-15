import React, { useState, useCallback } from 'react';
import './ToDoList.css';
import { useQuery, useMutation } from '@apollo/client';
import {
	Box, Card, CardContent,
	IconButton, Fab, Typography,
	TextField, CardActions, Grid
} from '@mui/material';
import Masonry from '@mui/lab/Masonry';

// Icons
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

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


	// Incomplete To Do Query
	const { loading, error, refetch } = useQuery(GET_INBOX_TODOS, {
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

	const handleClose = () => {
		setSelectedInboxItemId(null);
		refetch();
	};

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
	const handleDelete = (event: React.MouseEvent<HTMLButtonElement>, id: string) => {
		event.stopPropagation();
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
	const handleComplete = (event: React.MouseEvent<HTMLButtonElement>, toDoItem: InboxItem) => {
		event.stopPropagation();
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
		<Grid container>
			<Box
				component="form"
				noValidate
				autoComplete="off"
				onSubmit={handleSubmit}
				sx={{ width: "100%", display: "flex", justifyContent: "left" }}
			>
				<TextField
					id="outlined-basic"
					label="Add To Do"
					variant="outlined"
					value={newTodo}
					onChange={handleInputChange}
					type="search"
					sx={{ margin: 1, width: "80%" }}
				/>
				<Fab color="primary" aria-label="add" type="submit" sx={{ margin: 1 }}>
					<AddIcon />
				</Fab>
			</Box>


			{/* Inbox Items */}
			<Masonry columns={4} spacing={4} sx={{ padding: 2 }}>
				{toDoItems.map((item) => (
					<Card
						className="card"
						onClick={() => setSelectedInboxItemId(item.id)}
						sx={{ position: 'relative', maxHeight: 300, maxWidth: 200, border: 1, borderColor: 'black' }}
						key={item.id}
					>
						<CardContent sx={{
							overflow: 'hidden',
							maxHeight: 250,
							paddingBottom: '40px',
							marginBottom: '64px'
						}}>
							<Typography component="div" sx={{ wordWrap: 'break-word' }}>
								{item.title}
							</Typography>

							<Typography variant="body2" color="text.secondary">
								{item.description}
							</Typography>
						</CardContent>

						<CardActions className="card-actions" sx={{ position: 'absolute', bottom: 0, width: '100%' }}>

							<IconButton onClick={(event) => handleComplete(event, item)}>
								{item.completed ? <CheckIcon /> : <CloseIcon />}
							</IconButton>

							<IconButton onClick={(event) => handleDelete(event, item.id)}>
								<DeleteIcon />
							</IconButton>

						</CardActions>

					</Card>
				))}
			</Masonry>

			{selectedInboxItemId && <EditInboxItemDialog handleClose={handleClose} inboxItemId={selectedInboxItemId} />}
		</Grid>
	);
}

export default ToDoList;