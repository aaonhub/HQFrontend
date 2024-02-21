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
import { DELETE_TODO } from "../../../models/inboxitem";

// Models
import InboxItem from "../../../models/inboxitem";

interface ProjectToDoItemProps {
	toDoItem: InboxItem;
	setSelectedInboxItem: React.Dispatch<React.SetStateAction<InboxItem | undefined>>;
	handleCheck: (InboxItem: InboxItem) => (event: React.ChangeEvent<HTMLInputElement>) => void;
	refetch: () => void;
}

const ProjectToDoItem = ((props: ProjectToDoItemProps) => {

	// Delete Project Item
	const [deleteToDoItem] = useMutation(DELETE_TODO, {
		onError: (error) => console.log(error.networkError),
		onCompleted: () => {
			props.refetch()
		},
	})
	const handleDelete = (toDoItem: InboxItem) => (event: React.MouseEvent<HTMLButtonElement>) => {
		event.stopPropagation(); // Prevent event from bubbling to the ListItem
		deleteToDoItem({
			variables: {
				id: toDoItem.id,
			},
			onCompleted: () => {
				props.refetch()
			}
		})
	}


	const handleIconButtonClick = (event: React.MouseEvent<HTMLButtonElement>, toDoItem: InboxItem) => {
		event.stopPropagation(); // Stop the click event from propagating up to the parent ListItem
		props.handleCheck(toDoItem)(event as any); // Since handleCheck expects a ChangeEvent, we need to cast here
	};



	return (
		<React.Fragment key={props.toDoItem.id}>
			<ListItem
				onClick={() => {
					props.setSelectedInboxItem(props.toDoItem)
				}}
				secondaryAction={
					<>
						<IconButton edge="end" aria-label="delete" onClick={handleDelete(props.toDoItem)}>
							<DeleteIcon />
						</IconButton>
					</>
				}
				disablePadding
				style={{
					marginBottom: 4,
					backgroundColor: "black",
				}}
			>
				<ListItemButton role={undefined} dense>

					{/* Checkbox */}
					<ListItemIcon>
						<IconButton
							edge="start"
							onClick={(event) => handleIconButtonClick(event, props.toDoItem)}
							style={{ padding: 0 }}
						>
							<Checkbox
								checked={props.toDoItem.completed}
								tabIndex={-1}
								disableRipple
							/>
						</IconButton>
					</ListItemIcon>


					{/* Title */}
					<ListItemText
						primary={props.toDoItem.title}
						primaryTypographyProps={{
							style: {
								textDecoration: props.toDoItem.completed ? "line-through" : "none",
								color: props.toDoItem.completed ? "grey" : "inherit",
							},
						}}
					/>
				</ListItemButton>
			</ListItem>



		</React.Fragment>
	);
});

export default React.memo(ProjectToDoItem);
