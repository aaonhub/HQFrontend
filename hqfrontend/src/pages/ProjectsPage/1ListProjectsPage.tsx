import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { Box, List, Typography, TextField } from '@mui/material'
import ProjectListItem from './3ListProjectItem'

// Queries and Mutations
import { GET_PROJECTS } from '../../models/project'
import { CREATE_PROJECT } from '../../models/project'

// Models
import Project from '../../models/project'


const ProjectsPage = () => {
	const [newProjectCodename, setNewProjectCodename] = useState('')
	const [projects, setProjects] = useState<Project[]>([])

	// Projects Query
	const { loading, error, refetch } = useQuery(GET_PROJECTS, {
		onCompleted: (data) => {
			const projects = data.projects.map((project: any) => {
				return new Project(
					project.id,
					project.codename,
					project.to_do_items?.data || []
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
		},
		refetchQueries: [{ query: GET_PROJECTS }],
	})
	const handleCreateProject = async () => {
		await createProject({
			variables: {
				codename: newProjectCodename
			},
		})
	}



	if (loading) {
		return <div>Loading...</div>
	}

	if (error) {
		return <div>Error! {error.message}</div>
	}

	return (
		<Box sx={{ flexGrow: 1 }}>
			{/* Title */}
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
				autoComplete="off"
				onKeyDown={(e) => {
					if (e.key === 'Enter') {
						handleCreateProject()
					}
				}}
			/>


			{/* Project List */}
			<List sx={{ width: '100%', maxWidth: 360 }}>
				{projects.map((project) => (
					<ProjectListItem
						key={project.id}
						project={project}
						refetch={refetch}
					/>
				))}
			</List>
		</Box>
	)
}

export default ProjectsPage
