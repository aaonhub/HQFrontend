import {
	Checkbox,
	IconButton,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
} from "@mui/material";
import React from "react";

// Icons
import CommentIcon from "@mui/icons-material/Comment";

// Models
import InboxItem from "../../models/inboxitem";

interface ProjectToDoItemProps {
	toDoItem: InboxItem;
	setSelectedInboxItem: React.Dispatch<React.SetStateAction<InboxItem | undefined>>;
	handleCheck: (InboxItem: InboxItem) => (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProjectToDoItem = React.memo(({ toDoItem, handleCheck, setSelectedInboxItem }: ProjectToDoItemProps) => {
	return (
		<React.Fragment key={toDoItem.id}>
			<ListItem
				secondaryAction={
					<>
						<IconButton edge="end" aria-label="openmenu">
							<CommentIcon />
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
		</React.Fragment>
	);
});

// memo
export default React.memo(ProjectToDoItem);
