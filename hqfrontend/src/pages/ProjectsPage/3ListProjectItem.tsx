import { IconButton, ListItem, ListItemText, Menu, MenuItem } from "@mui/material";
import React, { useState } from "react";
import { Link } from 'react-router-dom'
import { useMutation } from "@apollo/client";

// Icons
import MoreVertIcon from '@mui/icons-material/MoreVert'
import DeleteIcon from '@mui/icons-material/Delete'

// Queries and Mutations
import { DELETE_PROJECT } from "../../models/project"

// Models
import Project from "../../models/project"


interface ProjectListItemProps {
	project: Project
	refetch: any
}

const ProjectListItem = React.memo(({ project, refetch }: ProjectListItemProps) => {
	const [anchorEl, setAnchorEl] = useState(null)
	const [currentProjectId, setCurrentProjectId] = useState('')


	const handleClick = (event: any, projectId: string) => {
		event.preventDefault()
		setAnchorEl(event.currentTarget)
		setCurrentProjectId(projectId)
	}
	const handleClose = () => {
		setAnchorEl(null)
	}

	const [deleteProject] = useMutation(DELETE_PROJECT, {
		onCompleted: (data) => {
			console.log(data)
		},
		onError: (error) => {
			console.log(error)
		},
	})
	const handleDelete = (event: any) => {
		event.preventDefault()
		deleteProject({
			variables: {
				id: currentProjectId,
			},
		})
		handleClose()
		refetch()
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
						<MenuItem onClick={(event) => handleDelete(event)}>
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