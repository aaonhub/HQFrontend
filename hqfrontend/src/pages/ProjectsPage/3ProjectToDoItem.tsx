import {
	Checkbox,
	IconButton,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
} from "@mui/material";

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

	// Delete Project Item
	const [deleteToDoItem] = useMutation(DELETE_TODO, {
		onError: (error) => console.log(error.networkError),
		onCompleted: () => {
			refetch()
		},
	})
	const handleDelete = (toDoItem: InboxItem) => () => {
		deleteToDoItem({
			variables: {
				id: toDoItem.id,
			},
			onCompleted: () => {
				refetch()
			}
		})
	}


	return (
		<React.Fragment key={toDoItem.id}>
			<ListItem
				onClick={() => {
					console.log(toDoItem)
					setSelectedInboxItem(toDoItem)
				}}
				secondaryAction={
					<>
						<IconButton edge="end" aria-label="delete" onClick={handleDelete(toDoItem)}>
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
						primaryTypographyProps={{
							style: {
								textDecoration: toDoItem.completed ? "line-through" : "none",
								color: toDoItem.completed ? "grey" : "inherit",
							},
						}}
					/>
				</ListItemButton>
			</ListItem>



		</React.Fragment>
	);
});

// memo
export default React.memo(ProjectToDoItem);
