import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { useMutation } from '@apollo/client';

import { UPDATE_TODO } from './toDoItemQueries';
import { ToDoItem } from "./InboxPage"

interface EditToDoItemDialogProps {
	showEditDialog: boolean;
	setShowEditDialog: React.Dispatch<React.SetStateAction<boolean>>;
	toDoItem: ToDoItem;
	setToDoItem: React.Dispatch<React.SetStateAction<ToDoItem>>;
}

export default function EditToDoItemDialog(props: EditToDoItemDialogProps): JSX.Element {
	const { showEditDialog, setShowEditDialog, toDoItem } = props;

	const [newTitle, setNewTitle] = useState(toDoItem.attributes.Title || '');
	const [newDescription, setNewDescription] = useState(toDoItem.attributes.Description || '');


	const [updateTodo] = useMutation(UPDATE_TODO, {
		onError: (error) => console.log(error.networkError),
	});

	const handleClose = () => {
		setShowEditDialog(false);
	};

	const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setNewTitle(e.target.value);
	};

	const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setNewDescription(e.target.value);
	};

	const handleSaveClick = () => {
		updateTodo({
			variables: {
				id: toDoItem.id,
				Title: newTitle,
				Description: newDescription,
			},
		});
		handleClose();
	};

	// Update state when showEditDialog changes to true
	useEffect(() => {
		if (showEditDialog) {
			setNewTitle(toDoItem.attributes.Title || '');
			setNewDescription(toDoItem.attributes.Description || '');
		}
	}, [showEditDialog, toDoItem.attributes.Title, toDoItem.attributes.Description]);

	return (
		<Dialog open={showEditDialog} onClose={handleClose}>
			<DialogTitle>Edit Todo Item</DialogTitle>
			<DialogContent>
				<TextField
					autoFocus
					margin="dense"
					label="New Title"
					value={newTitle}
					onChange={handleTitleChange}
					fullWidth
					autoComplete="off"
				/>
				<TextField
					margin="dense"
					label="Description"
					value={newDescription}
					onChange={handleDescriptionChange}
					fullWidth
					autoComplete="off"
				/>
			</DialogContent>

			<DialogActions>
				<Button onClick={handleClose}>Cancel</Button>
				<Button onClick={handleSaveClick}>Save</Button>
			</DialogActions>
		</Dialog>
	);
}
