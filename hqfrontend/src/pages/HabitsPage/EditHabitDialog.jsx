import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { useMutation } from '@apollo/client';

import { UPDATE_HABIT } from './habitQueries';

const EditHabitDialog = ({ showEditDialog, setShowEditDialog, habit = {} }) => {
	const [newID, setNewID] = useState(toDoItem.id || '');
	const [newTitle, setNewTitle] = useState(toDoItem.attributes?.Title || '');
	const [newActive, setNewActive] = useState(toDoItem.attributes?.Active || '');
	const [newFrequency, setNewFrequency] = useState(toDoItem.attributes?.Frequency || '');

	const [updateHabit] = useMutation(UPDATE_HABIT, {
		onError: (error) => console.log(error.networkError),
	});

	const handleClose = () => {
		setShowEditDialog(false);
	};

	const handleTitleChange = (e) => {
		setNewTitle(e.target.value);
	};

	const handleActiveChange = (e) => {
		setNewActive(e.target.value);
	};

	const handleFrequencyChange = (e) => {
		setNewFrequency(e.target.value);
	};

	const handleSaveClick = () => {
		updateHabit({
			variables: {
				id: habit.id,
				data: {
					Title: newTitle,
					Active: newActive,
					Frequency: newFrequency,
				},
			},
		});
		handleClose();
	};

	// Update state when showEditDialog changes to true
	useEffect(() => {
		if (showEditDialog) {
			setNewID(habit.id || '');
			setNewTitle(habit.attributes?.Title || '');
			setNewActive(habit.attributes?.Active || '');
			setNewFrequency(habit.attributes?.Frequency || '');
		}
	}, [showEditDialog, habit]);

	return (
		<Dialog open={showEditDialog} onClose={handleClose}>
			<DialogTitle>Edit Habit</DialogTitle>
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
					label="New Active"
					value={newActive}
					onChange={handleActiveChange}
					fullWidth
					autoComplete="off"
				/>

				<TextField
					margin="dense"
					label="New Frequency"
					value={newFrequency}
					onChange={handleFrequencyChange}
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
};

export default EditHabitDialog;