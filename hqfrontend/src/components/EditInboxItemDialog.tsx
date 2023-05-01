import React, { useState } from "react";
import {
	Checkbox,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControlLabel,
	TextField,
	Button,
	Box,
} from "@mui/material";
import { dateToYYYYMMDD, yyyymmddToDate } from "./DateFunctions";

// Models
import InboxItem from "../models/inboxitem";
import { ContactlessOutlined } from "@mui/icons-material";

interface ProjectToDoItemProps {
	handleClose: (inboxItem?: InboxItem) => void;
	inboxItem: InboxItem;
}

const EditInboxItemDialog = React.memo(({ handleClose, inboxItem }: ProjectToDoItemProps) => {
	const [newInboxItem, setNewInboxItem] = useState(inboxItem);


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



	return (
		<Dialog open={true} onClose={() => handleClose()}>
			<DialogTitle>Edit ToDo Item</DialogTitle>
			<DialogContent>
				<Box
					component="form"
					sx={{
						"& > :not(style)": { m: 1, width: "25ch" },
					}}
					noValidate
					autoComplete="off"
					onSubmit={(e) => {
						e.preventDefault();
						handleClose(newInboxItem);
					}}
				>
					<TextField
						name="title"
						label="Title"
						variant="outlined"
						value={newInboxItem.title}
						onChange={handleInputChange}
					/>
					<TextField
						name="description"
						label="Description"
						variant="outlined"
						value={newInboxItem.description}
						onChange={handleInputChange}
					/>
					<TextField
						name="startDate"
						label="Start Date"
						type="date"
						variant="outlined"
						InputLabelProps={{
							shrink: true,
						}}
						value={newInboxItem.startDate ? newInboxItem.startDate : ''}
						onChange={handleInputChange}
					/>
					<TextField
						name="dueDateTime"
						label="Due Date"
						type="date"
						variant="outlined"
						InputLabelProps={{
							shrink: true,
						}}
						value={newInboxItem.dueDateTime ? newInboxItem.dueDateTime : ''}
						onChange={handleInputChange}
					/>
				</Box>
			</DialogContent>
			<DialogActions>
				<Button onClick={() => handleClose()} color="primary">
					Cancel
				</Button>
				<Button onClick={() => handleClose(newInboxItem)} color="primary">
					Save
				</Button>
			</DialogActions>
		</Dialog>
	);
});

export default EditInboxItemDialog;
