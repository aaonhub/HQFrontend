import {
	Button,
	Checkbox,
	IconButton,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
} from "@mui/material";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

import React from "react";
import { useMutation } from "@apollo/client";

// Icons
import DeleteIcon from "@mui/icons-material/Delete";

// Queries and Mutations
import { DELETE_TODO } from "../../models/inboxitem";

// Models
import InboxItem from "../../models/inboxitem";

interface ProjectToDoItemProps {
	toDoItem: InboxItem;
	setSelectedInboxItem: React.Dispatch<React.SetStateAction<InboxItem | undefined>>;
	handleCheck: (InboxItem: InboxItem) => (event: React.ChangeEvent<HTMLInputElement>) => void;
	refetch: () => void;
}

const ProjectToDoItem = (({ toDoItem, handleCheck, setSelectedInboxItem, refetch }: ProjectToDoItemProps) => {
	const [openDialog, setOpenDialog] = React.useState(false);

	const [deleteToDo] = useMutation(DELETE_TODO, {
		variables: { id: toDoItem.id },
	});
	const openDeleteDialog = () => {
		setOpenDialog(true);
	};
	const closeDeleteDialog = () => {
		setOpenDialog(false);
	};
	const handleDelete = () => {
		closeDeleteDialog();
		deleteToDo();
		refetch();
	};


	return (
		<React.Fragment key={toDoItem.id}>
			<ListItem
				secondaryAction={
					<>
						<IconButton edge="end" aria-label="delete" onClick={openDeleteDialog}>
							<DeleteIcon />
						</IconButton>
					</>
				}
				disablePadding
			>
				<ListItemButton role={undefined} dense>

					{/* Handle Icon */}
					<ListItemIcon>
						<span className="drag-handle">&#x2630;</span>
					</ListItemIcon>

					{/* Checkbox */}
					<ListItemIcon>
						<Checkbox
							edge="start"
							checked={toDoItem.completed}
							onChange={handleCheck(toDoItem)}
							tabIndex={-1}
							disableRipple
						/>
					</ListItemIcon>

					{/* Title */}
					<ListItemText
						primary={toDoItem.title}
						onClick={() => setSelectedInboxItem(toDoItem)}
						primaryTypographyProps={{
							style: {
								textDecoration: toDoItem.completed ? "line-through" : "none",
								color: toDoItem.completed ? "grey" : "inherit",
							},
						}}
					/>
				</ListItemButton>
			</ListItem>

			<Dialog
				open={openDialog}
				onClose={closeDeleteDialog}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						Are you sure you want to delete this item?
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={closeDeleteDialog} color="primary">
						Cancel
					</Button>
					<Button onClick={handleDelete} color="primary" autoFocus>
						Confirm
					</Button>
				</DialogActions>
			</Dialog>

		</React.Fragment>
	);
});

// memo
export default React.memo(ProjectToDoItem);
