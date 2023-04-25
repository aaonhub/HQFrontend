import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { Box, Typography, Fab, TextField } from '@mui/material';
import List from '@mui/material/List';
import ProjectToDoItem from './ProjectToDoItem';
import EditInboxItemDialog from '../../components/EditInboxItemDialog';

// Icons
import { Add } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import ArrowBack from '@mui/icons-material/ArrowBack';

// Queries and Mutations
import { GET_PROJECT } from '../../models/project';
import { CREATE_TO_DO_AND_ADD_TO_PROJECT } from '../../models/project';
import { UPDATE_TODO } from '../../models/inboxitem';

// Models
import Project from '../../models/project';
import InboxItem, { COMPLETE_UNCOMPLETE_TODO } from '../../models/inboxitem';


const ProjectPage = () => {
	const { projectId } = useParams();
	const [newProjectItem, setNewProjectItem] = useState('');
	const [project, setProject] = useState<Project>(new Project('', ''));
	const [selectedInboxItem, setSelectedInboxItem] = useState<InboxItem>()

	useEffect(() => {
		console.log(selectedInboxItem)
	}, [selectedInboxItem])

	// Project Query
	const { loading, error, refetch } = useQuery(GET_PROJECT, {
		variables: { id: projectId },
		onCompleted: (data) => {
			const projectData = data.project.data
			const project: Project = {
				id: projectData.id,
				codename: projectData.attributes.Codename,
				to_do_items: projectData.attributes.to_do_items.data.map(
					(item: any) => new InboxItem({
						id: item.id,
						title: item.attributes.Title,
						completed: item.attributes.Completed,
						project: item.attributes.Project,
						dueDate: new Date(item.attributes.DueDate),
						description: item.attributes.Description,
						startDate: new Date(item.attributes.StartDate),
						startTime: new Date(item.attributes.StartTime)
					})
				),
			};
			setProject(project);
		},
	});


	// Add Inbox Item Mutation
	const [addItemToProject] = useMutation(CREATE_TO_DO_AND_ADD_TO_PROJECT, {
		onError: (error) => console.log(error.networkError),
		onCompleted: () => {
			setNewProjectItem('')
			refetch()
		},
	});
	const handleAddProjectItem = () => {
		addItemToProject({
			variables: {
				Title: newProjectItem,
				projectid: projectId,
			},
		});

	};


	// Check off to do item
	const [completeToDoItem] = useMutation(COMPLETE_UNCOMPLETE_TODO, {
		onError: (error) => console.log(error.networkError),
		onCompleted: () => {
			refetch()
		},
	});
	const handleCheck = (value: string, completed: boolean) => () => {
		completeToDoItem({
			variables: {
				id: value,
				Completed: !completed,
			},
		});
	};

	
	const [updateToDo] = useMutation(UPDATE_TODO)
	const handleUpdateToDo = (inboxItem: InboxItem) => {
		updateToDo({
			variables: {
				id: inboxItem.id,
				data: {
					Title: inboxItem.title,
					Completed: inboxItem.completed,
				},
			},
		})
	}
	const handleClose = (inboxItem?: InboxItem) => {
		if (inboxItem) {
			// update index item in project
			const newProject = { ...project }
			const index = newProject.to_do_items?.findIndex(item => item.id === inboxItem.id)
			if (index) {
				newProject.to_do_items![index] = inboxItem
			}
			handleUpdateToDo(inboxItem)
			setProject(newProject)
			setSelectedInboxItem(undefined)
		}
		else {
			setSelectedInboxItem(undefined)
		}
	};



	if (loading) { return <div>Loading...</div> }
	if (error) { return <div>Error! {error.message}</div> }


	return (
		<Box sx={{ flexGrow: 1 }}>



			{/* Title */}
			<Box sx={{ display: 'flex', marginBottom: 2 }}>
				{/* Back arrow */}
				<IconButton onClick={() => window.history.back()} edge="start" color="inherit" aria-label="back">
					<ArrowBack />
				</IconButton>
				{/* Title */}
				<Typography variant="h4">
					{project.codename}
				</Typography>
			</Box>

			{/* Text input that adds to do list items to the project */}
			<TextField
				fullWidth
				label="Add Project Item"
				value={newProjectItem}
				onChange={(e) => setNewProjectItem(e.target.value)}
				variant="outlined"
				size="small"
				onKeyDown={(e) => {
					if (e.key === 'Enter') {
						handleAddProjectItem();
					}
				}}
			/>


			{/* To-Do Items */}
			<List sx={{ width: '100%', maxWidth: 360 }}>
				{project.to_do_items &&
					project.to_do_items.map((toDoItem) => (
						<ProjectToDoItem
							key={toDoItem.id}
							toDoItem={toDoItem}
							handleCheck={handleCheck}
							setSelectedInboxItem={setSelectedInboxItem}
						/>
					))}
			</List>


			{/* dialog */}
			{selectedInboxItem &&
				<EditInboxItemDialog handleClose={handleClose} inboxItem={selectedInboxItem} />
			}


			{/* Floating Action Button */}
			<Box sx={{ position: 'fixed', bottom: '16px', right: '16px' }}>
				<Fab color="primary" aria-label="add">
					<Add />
				</Fab>
			</Box>


		</Box>
	);
};

export default ProjectPage;
