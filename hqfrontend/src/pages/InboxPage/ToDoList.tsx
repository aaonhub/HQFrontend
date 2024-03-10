import React, { useState, useCallback } from 'react';
import './ToDoList.css';
import { useQuery, useMutation } from '@apollo/client';

import Typography from '@mui/joy/Typography';
import IconButton from '@mui/joy/IconButton';
import Grid from '@mui/joy/Grid';
import CardContent from '@mui/joy/CardContent';
import Card from '@mui/joy/Card';
import Input from '@mui/joy/Input';
import Box from '@mui/joy/Box';
import Masonry from '@mui/lab/Masonry';
import CardActions from '@mui/joy/CardActions';
import Button from '@mui/joy/Button';

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
	const handleDelete = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
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
	const handleComplete = (event: React.MouseEvent<HTMLAnchorElement>, toDoItem: InboxItem) => {
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
				<Input
					id="outlined-basic"
					placeholder="Add To Do"
					variant="outlined"
					value={newTodo}
					onChange={handleInputChange}
					sx={{
						margin: 1,
						width: "100%",
						"--Input-minHeight": "50px"
					}}
					autoComplete="off"
					type='search'
					endDecorator={<Button type="submit" color="primary">Add</Button>}
				/>
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
						}}>
							<Typography component="div" sx={{ wordWrap: 'break-word' }}>
								{item.title}
							</Typography>

							<Typography level="body-sm" color="primary">
								{item.description}
							</Typography>
						</CardContent>

						<CardActions>

							<IconButton onClick={(event) => handleComplete(event, item)}>
								{item.completed ? <CheckIcon /> : <CloseIcon />}
							</IconButton>

							<IconButton
								className="delete-button"
								onClick={(event) => handleDelete(event, item.id)}
								sx={{
									'&:hover': {
										color: 'red',
									},
								}}
							>
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