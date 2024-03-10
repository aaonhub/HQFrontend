import Checkbox from '@mui/joy/Checkbox';
import ListItem from '@mui/joy/ListItem';
import React from "react";
import { useMutation } from "@apollo/client";

import ListItemButton from '@mui/joy/ListItemButton';
import IconButton from '@mui/joy/IconButton';

// Icons
import Delete from '@mui/icons-material/Delete';

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
			props.refetch();
		},
	});

	const handleDelete = (toDoItem: InboxItem) => (event: React.MouseEvent<HTMLButtonElement>) => {
		event.stopPropagation(); // Prevent event from bubbling to the ListItem
		deleteToDoItem({
			variables: {
				id: toDoItem.id,
			},
			onCompleted: () => {
				props.refetch();
			},
		});
	};

	const handleIconButtonClick = (toDoItem: InboxItem) => {
		props.handleCheck(toDoItem)(event as any); // Since handleCheck expects a ChangeEvent, we need to cast here
	};

	return (
		<React.Fragment key={props.toDoItem.id}>
			<ListItem
				startAction={
					<IconButton
						aria-label="Add"
						size="sm"
						variant="plain"
						color="neutral"
						onClick={() => handleIconButtonClick(props.toDoItem)}
					>
						<Checkbox checked={props.toDoItem.completed} tabIndex={-1} />
					</IconButton>
				}
				endAction={
					<IconButton aria-label="Delete" size="sm" color="danger" onClick={handleDelete(props.toDoItem)}>
						<Delete />
					</IconButton>
				}
			>
				<ListItemButton
					onClick={() => { props.setSelectedInboxItem(props.toDoItem); }}
				>{props.toDoItem.title}</ListItemButton>
			</ListItem>
		</React.Fragment>
	);
});

export default React.memo(ProjectToDoItem);