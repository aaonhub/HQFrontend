import { useEffect, useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { Box, List, Typography, TextField } from '@mui/material'
import ProjectListItem from './components/ListProjectItem'
import { useGlobalContext } from '../App/GlobalContextProvider'

// Queries and Mutations
import { GET_PROJECTS } from '../../models/project'
import { CREATE_PROJECT } from '../../models/project'
import { UPDATE_SETTINGS } from '../../models/settings'

// Models
import Project from '../../models/project'
import { ReactSortable, SortableEvent } from 'react-sortablejs'
import { sortObjectsByIds } from '../../components/MiscFunctions'


const ProjectsPage = () => {
	// Tab Title
	useEffect(() => { document.title = "Projects - HQ"; }, []);

	const { setDebugText } = useGlobalContext()
	const [newProjectCodename, setNewProjectCodename] = useState('')
	const [projects, setProjects] = useState<Project[]>([])



	// Projects Query
	const { loading, error, data, refetch } = useQuery(GET_PROJECTS, {
		fetchPolicy: 'network-only',

		onCompleted: (data) => {
			let order = data.settings.projectOrder
			try {
				order = JSON.parse(order);
			} catch (e) {
				order = [];
			}

			const projects = data.projects.map((project: any) => {
				return new Project(
					project.id,
					project.codename,
					project.to_do_items?.data || []
				)
			})
			const sortedProjects = sortObjectsByIds(projects, order) as Project[];
			console.log(sortedProjects)
			setProjects(sortedProjects)
		},

		onError: (error) => console.log(error),
	})


	// Debugging
	useEffect(() => {
		setDebugText([
			{ title: 'Projects', content: JSON.stringify(projects, null, 2) },
			{ title: "data", content: JSON.stringify(data, null, 2) }
		])
	}, [projects, data])


	const [updateOrCreateProjectOrder] = useMutation(UPDATE_SETTINGS, {
		onError: (error) => console.log(error),
		refetchQueries: [{ query: GET_PROJECTS }],
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



	if (loading) { return (<div>Loading...</div>) }

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
