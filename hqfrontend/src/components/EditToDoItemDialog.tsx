import React, { useState } from "react";
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
	Button,
	Box,
	Checkbox,
	FormControlLabel,
} from "@mui/material";
import { useMutation, useQuery } from "@apollo/client";

// Components
import { useGlobalContext } from "../pages/App/GlobalContextProvider";

// Models
import InboxItem from "../models/inboxitem";

// Queries and Mutations
import { UPDATE_TODO } from "../models/inboxitem";
import { GET_INBOX_TODO } from "../models/inboxitem";
import { DELETE_TODO } from "../models/inboxitem";


interface ProjectToDoItemProps {
	handleClose: (removed?: boolean) => void;
	inboxItemId: string;
}

const EditInboxItemDialog = React.memo(({ handleClose, inboxItemId }: ProjectToDoItemProps) => {
	const { setSnackbar } = useGlobalContext();

	// State
	const [newInboxItem, setNewInboxItem] = useState(new InboxItem({
		id: '',
		title: '',
		description: '',
		completed: false,
		project: null,
		dueDateTime: null,
		startDate: null,
		startTime: null,
		timeCompleted: null,
	}));


	// InboxItem Query
	const { loading, error } = useQuery(GET_INBOX_TODO, {
		variables: { id: inboxItemId },
		fetchPolicy: "network-only",
		onCompleted: (data) => {
			console.log(data);
			setNewInboxItem(
				new InboxItem({
					id: data.toDoItem.id,
					title: data.toDoItem.title,
					description: data.toDoItem.description,
					completed: data.toDoItem.completed,
					project: data.toDoItem.project,
					dueDateTime: data.toDoItem.dueDateTime,
					startDate: data.toDoItem.startDate,
					startTime: data.toDoItem.startTime,
					timeCompleted: data.toDoItem.timeCompleted,
				})
			)
		}
	});


	// InboxItem Update
	const [updateInboxItem] = useMutation(UPDATE_TODO);
	const handleSave = () => {
		console.log(newInboxItem);
		/* FINISHLATER */ 
		// Add to project selector
		// Add subtasks
		// Add completion checkbox
		// Add start time

		// get duedatetime from due date
		const dueDateTime = newInboxItem.dueDateTime ? new Date(newInboxItem.dueDateTime) : null;
		try {
			updateInboxItem({
				variables: {
					ID: newInboxItem.id,
					Title: newInboxItem.title,
					Description: newInboxItem.description,
					StartDate: newInboxItem.startDate,
					DueDateTime: dueDateTime,
					Completed: newInboxItem.completed,
				},
				onCompleted: () => {
					setSnackbar({
						open: true,
						message: "Inbox Item Updated",
						severity: "success",
					});
					handleClose();
				}
			});
		} catch (error) {
			console.log(error);
		}
	};

	// InboxItem Delete
	const [deleteInboxItem] = useMutation(DELETE_TODO);
	const handleDelete = () => {
		try {
			deleteInboxItem({
				variables: {
					id: inboxItemId,
				},
				onCompleted: () => {
					handleClose(true);
					setSnackbar({
						open: true,
						message: "Inbox Item Deleted",
						severity: "success",
					});
				}
			});
		} catch (error) {
			console.log(error);
		}
	};


	// Input Change Logic
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		console.log(name, value);
		setNewInboxItem((prev) => {
			const updatedValue = name === 'startDate' || name === 'dueDateTime'
				?
				value === ''
					? null
					:
					value
				:
				value
			return { ...prev, [name]: updatedValue };
		});
	};



	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error :(</p>;

	return (
		<Dialog open={true} onClose={() => handleClose()}>
			<DialogTitle>Edit To Do Item</DialogTitle>
			<DialogContent>
				<Box
					component="form"
					noValidate
					autoComplete="off"
					onSubmit={(e) => {
						e.preventDefault();
						handleClose();
					}}
				>

					{/* Title */}
					<Box m={2}>
						<TextField
							name="title"
							label="Title"
							variant="outlined"
							value={newInboxItem.title}
							onChange={handleInputChange}
							sx={{ width: "60ch" }}
						/>
					</Box>

					{/* Description */}
					<Box m={2}>
						<TextField
							name="description"
							label="Description"
							variant="outlined"
							value={newInboxItem.description}
							onChange={handleInputChange}
							multiline // added this line
							rows={4} // minimum 4 lines visible
							sx={{ width: "60ch" }}
						/>
					</Box>

					<Box m={2}>

						{/* Start Date */}
						<TextField
							name="startDate"
							label="Start Date"
							type="date"
							variant="outlined"
							InputLabelProps={{
								shrink: true,
							}}
							sx={{ marginRight: "2ch" }}
							value={newInboxItem.startDate ? newInboxItem.startDate : ''}
							onChange={handleInputChange}
						/>

						{/* Due Date */}
						<TextField
							name="dueDateTime"
							label="Due Date"
							type="datetime-local"
							variant="outlined"
							InputLabelProps={{
								shrink: true,
							}}
							sx={{ marginRight: "2ch" }}
							value={newInboxItem.dueDateTime ? newInboxItem.dueDateTime : ''}
							onChange={handleInputChange}
						/>
					</Box>

					{/* Completed */}
					<Box m={2}>
						<FormControlLabel
							control={
								<Checkbox
									checked={newInboxItem.completed}
									onChange={(event) => {
										const { checked } = event.target;
										setNewInboxItem((prev) => {
											return { ...prev, completed: checked };
										});
									}}
								/>
							}
							label="Completed"
						/>
					</Box>

				</Box>
			</DialogContent>
			<DialogActions>
				<Button onClick={() => handleDelete()} color="primary">
					Delete
				</Button>
			</DialogActions>
			<DialogActions>
				<Button onClick={() => handleClose()} color="primary">
					Cancel
				</Button>
				<Button onClick={() => handleSave()} color="primary">
					Save
				</Button>
			</DialogActions>
		</Dialog>
	);
});

export default EditInboxItemDialog;
