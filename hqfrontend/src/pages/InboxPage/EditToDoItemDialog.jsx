import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { useMutation } from '@apollo/client';

import { UPDATE_TODO } from './toDoItemQueries';

const EditToDoItemDialog = ({ showEditDialog, setShowEditDialog, toDoItem = {} }) => {
	const [newTitle, setNewTitle] = useState(toDoItem.attributes?.Title || '');
	const [newDescription, setNewDescription] = useState(toDoItem.attributes?.Description || '');
	const [newStart, setNewStart] = useState(toDoItem.attributes?.StartDate || '');

	const [updateTodo] = useMutation(UPDATE_TODO, {
		onError: (error) => console.log(error.networkError),
	});

	const handleClose = () => {
		setShowEditDialog(false);
	};

	const handleTitleChange = (e) => {
		setNewTitle(e.target.value);
	};

	const handleDescriptionChange = (e) => {
		setNewDescription(e.target.value);
	};

	const handleStartChange = (e) => {
		setNewStart(e.target.value);
	};

	const handleSaveClick = () => {
		updateTodo({
			variables: {
				id: toDoItem.id,
				data: {
					Title: newTitle,
					Description: newDescription,
					StartDate: newStart,
				},
			},
		});
		handleClose();
	};

	// Update state when showEditDialog changes to true
	useEffect(() => {
		if (showEditDialog) {
			setNewTitle(toDoItem.attributes?.Title || '');
			setNewDescription(toDoItem.attributes?.Description || '');
			setNewStart(toDoItem.attributes?.StartDate || '');
		}
	}, [showEditDialog, toDoItem.attributes?.Title, toDoItem.attributes?.Description, toDoItem.attributes?.StartDate]);

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

				<div>
					<label htmlFor="start-date">Start Date:</label>
					<input
						type="date"
						id="start-date"
						value={newStart}
						onChange={handleStartChange}
					/>
				</div>
			</DialogContent>

			<DialogActions>
				<Button onClick={handleClose}>Cancel</Button>
				<Button onClick={handleSaveClick}>Save</Button>
			</DialogActions>
		</Dialog>
	);
};

export default EditToDoItemDialog;