import { useEffect, useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { Box, List, Typography, TextField } from '@mui/material'
import ProjectListItem from './3ListProjectItem'
import { useGlobalContext } from '../App/GlobalContextProvider'

// Queries and Mutations
import { GET_PROJECTS } from '../../models/project'
import { CREATE_PROJECT } from '../../models/project'
import { UPDATE_OR_CREATE_PROJECT_ORDER } from '../../models/settings'
import { GET_SETTINGS } from '../../models/settings'

// Models
import Project from '../../models/project'
import { ReactSortable, SortableEvent } from 'react-sortablejs'


const ProjectsPage = () => {
	// Tab Title
	useEffect(() => {
		document.title = "Projects - HQ";
	}, []);
	const [newProjectCodename, setNewProjectCodename] = useState('')
	const [projects, setProjects] = useState<Project[]>([])


	// Projects Query
	const { data, loading, error, refetch } = useQuery(GET_PROJECTS, {
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
		onError: (error) => console.log(error.networkError),
	})




	// Project Order
	const { data: projectOrderData, loading: projectOrderLoading, error: projectOrderError } = useQuery(GET_SETTINGS, {
		fetchPolicy: 'network-only',
		onError: (error) => console.log(error),
	})


	useEffect(() => {
		if ((projectOrderData && data) && projectOrderData.settings.projectOrder) {
			// Add all projects that are in the order
			const order = JSON.parse(projectOrderData.settings.projectOrder);
			let projects = order.map((projectId: string) => {
				return new Project(
					projectId,
					data.projects.find((project: any) => project.id === projectId)?.codename || '',
					data.projects.find((project: any) => project.id === projectId)?.to_do_items?.data || []
				)
			});

			// Add all projects that are not in the order to the
			data.projects.forEach((project: any) => {
				if (!projects.find((p: any) => p.id === project.id)) {
					projects.unshift(new Project(
						project.id,
						project.codename,
						project.to_do_items?.data || []
					));
				}
			});

			// Filter out the projects with empty codename and to_do_items
			projects = projects.filter((project: any) => project.codename !== '');


			console.log(projects);
			setProjects(projects);
		}
	}, [data, projectOrderData]);

	const [updateOrCreateProjectOrder] = useMutation(UPDATE_OR_CREATE_PROJECT_ORDER, {
		onError: (error) => console.log(error),
		refetchQueries: [{ query: GET_SETTINGS }],
	})
	const handleProjectOrderChange = (evt: SortableEvent) => {
		const newIndex = evt.newIndex
		const oldIndex = evt.oldIndex

		if (typeof newIndex === 'undefined' || typeof oldIndex === 'undefined') {
			return
		}

		const projectIds = projects.map((project) => project.id)

		const newProjectIds = [...projectIds]
		newProjectIds.splice(newIndex, 0, newProjectIds.splice(oldIndex, 1)[0])

		updateOrCreateProjectOrder({
			variables: {
				projectOrder: JSON.stringify(newProjectIds)
			}
		})
	}







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



	if (loading || projectOrderLoading) {
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
				<ReactSortable
					list={projects}
					setList={setProjects}
					animation={150}
					onEnd={handleProjectOrderChange}
				>
					{projects.map((project) => (
						<ProjectListItem
							key={project.id}
							project={project}
							refetch={refetch}
						/>
					))}
				</ReactSortable>
			</List>
		</Box>
	)
}

export default ProjectsPage
