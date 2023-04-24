import { IconButton, ListItem, ListItemText, Menu, MenuItem } from "@mui/material";
import React, { useState } from "react";
import { Link } from 'react-router-dom'

// Icons
import MoreVertIcon from '@mui/icons-material/MoreVert'
import DeleteIcon from '@mui/icons-material/Delete'

// Models
import Project from "../../models/project"


interface ProjectListItemProps {
	project: Project
}

const ProjectListItem = React.memo(({ project }: ProjectListItemProps) => {
	const [anchorEl, setAnchorEl] = useState(null)
	const [currentProjectId, setCurrentProjectId] = useState('')


	const handleClick = (event: any, projectId: string) => {
		setAnchorEl(event.currentTarget)
		setCurrentProjectId(projectId)
	}
	const handleClose = () => {
		setAnchorEl(null)
	}
	const handleDelete = () => {
		console.log('Project ID:', currentProjectId)
		// Add your delete function here
		handleClose()
	}

	return (
		<ListItem
			key={project.id}
			button
			component={Link}
			to={`/project/${project.id}`}
			secondaryAction={
				<>
					<IconButton
						edge="end"
						onClick={(event) => handleClick(event, project.id)}
					>
						<MoreVertIcon />
					</IconButton>
					<Menu
						anchorEl={anchorEl}
						keepMounted
						open={Boolean(anchorEl)}
						onClose={handleClose}
					>
						<MenuItem onClick={handleDelete}>
							<DeleteIcon />
							Delete
						</MenuItem>
					</Menu>
				</>
			}
		>
			<ListItemText primary={project.codename} />
		</ListItem>
	);
});

export default ProjectListItem;