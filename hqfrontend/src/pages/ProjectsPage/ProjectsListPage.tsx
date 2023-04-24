import React, { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import {
	Box,
	List,
	ListItem,
	ListItemText,
	Typography,
	TextField,
	IconButton,
	Menu,
	MenuItem,
} from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import DeleteIcon from '@mui/icons-material/Delete'
import { Link } from 'react-router-dom'

// Query
import { GET_PROJECTS } from '../../models/project'
import { CREATE_PROJECT } from '../../models/project'

// Models
import Project from '../../models/project'


const ProjectsPage = () => {
	const [newProjectCodename, setNewProjectCodename] = useState('')
	const [anchorEl, setAnchorEl] = useState(null)
	const [currentProjectId, setCurrentProjectId] = useState('')
	const [projects, setProjects] = useState<Project[]>([])


	const { loading, error, data, refetch } = useQuery(GET_PROJECTS, {
		onCompleted: (data) => {
			const projectsData = data.projects.data
			const projects = projectsData.map((project: any) => {
				return new Project(
					project.id,
					project.attributes.Codename,
					project.attributes.to_do_items?.data || []
				)
			})
			setProjects(projects)
		},
	})


	// Create project mutation
	const [createProject] = useMutation(CREATE_PROJECT, {
		onError: (error) => console.log(error.networkError),
		onCompleted: () => {
			setNewProjectCodename('')
			refetch()
		},
	})

	const handleCreateProject = async () => {
		await createProject({
			variables: {
				data: {
					Codename: newProjectCodename,
				},
			},
		})
	}

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

	if (loading) {
		return <div>Loading...</div>
	}

	if (error) {
		return <div>Error! {error.message}</div>
	}

	return (
		<Box sx={{ flexGrow: 1 }}>
			<Typography variant="h3" gutterBottom>
				Projects
			</Typography>

			{/* New Project Input Box */}
			<TextField
				fullWidth
				label="Create New Project"
				value={newProjectCodename}
				onChange={(e) => setNewProjectCodename(e.target.value)}
				variant="outlined"
				size="small"
				onKeyDown={(e) => {
					if (e.key === 'Enter') {
						handleCreateProject()
					}
				}}
			/>

			{/* Project List */}
			<List sx={{ width: '100%', maxWidth: 360 }}>
				{projects.map((project) => (
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
				))}
			</List>
		</Box>
	)
}

export default ProjectsPage
