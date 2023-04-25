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

// Models
import InboxItem from "../models/inboxitem";

interface ProjectToDoItemProps {
	handleClose: (inboxItem?: InboxItem) => void;
	inboxItem: InboxItem;
}

const EditInboxItemDialog = React.memo(({ handleClose, inboxItem }: ProjectToDoItemProps) => {
	const [newInboxItem, setNewInboxItem] = useState(inboxItem)


	const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setNewInboxItem({ ...newInboxItem, title: e.target.value })
	};

	const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setNewInboxItem({ ...newInboxItem, completed: e.target.checked })
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
						id="outlined-basic"
						label="Title"
						variant="outlined"
						value={newInboxItem.title}
						onChange={handleTitleChange}
					/>
					<FormControlLabel
						control={
							<Checkbox
								checked={newInboxItem.completed}
								onChange={handleCheckboxChange}
								inputProps={{ "aria-label": "controlled" }}
							/>
						}
						label="Completed"
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