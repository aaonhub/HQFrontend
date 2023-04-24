import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { Box, Typography, Fab, TextField } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';

// Icons
import { Add } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import CommentIcon from '@mui/icons-material/Comment';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Checkbox from '@mui/material/Checkbox';
import ArrowBack from '@mui/icons-material/ArrowBack';

// Queries and Mutations
import { GET_PROJECT } from '../../models/project';
import { CREATE_TO_DO_AND_ADD_TO_PROJECT } from '../../models/project';

// Models
import Project from '../../models/project';
import InboxItem, { COMPLETE_UNCOMPLETE_TODO } from '../../models/inboxitem';


const ProjectPage = () => {
	const { projectId } = useParams();
	const [newProjectItem, setNewProjectItem] = useState('');
	const [project, setProject] = useState<Project>(new Project('', ''));

	// Project Query
	const { loading, error, refetch } = useQuery(GET_PROJECT, {
		variables: { id: projectId },
		onCompleted: (data) => {
			const projectData = data.project.data;
			const project: Project = {
				id: projectData.id,
				codename: projectData.attributes.Codename,
				to_do_items: projectData.attributes.to_do_items.data.map(
					(item: any) => new InboxItem(
						item.id,
						item.attributes.Title,
						'ToDo', // Set the appropriate type value here
						item.attributes.Completed,
						projectData, // Pass the entire project data
						new Date(item.attributes.DueDate),
						item.attributes.Description,
						new Date(item.attributes.StartDate),
						new Date(item.attributes.StartTime)
					)
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



	if (loading) { return <div>Loading...</div> }
	if (error) { return <div>Error! {error.message}</div> }


	return (
		<Box sx={{ flexGrow: 1 }}>


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
				{project.to_do_items && project.to_do_items.map((toDoItem) => (
					<React.Fragment key={toDoItem.id}>
						<ListItem
							secondaryAction={
								<IconButton edge="end" aria-label="openmenu">
									<CommentIcon />
								</IconButton>
							}
							disablePadding
						>

							<ListItemButton role={undefined} dense>
								<ListItemIcon>
									<Checkbox
										edge="start"
										checked={toDoItem.completed}
										onChange={handleCheck(toDoItem.id, toDoItem.completed)}
										tabIndex={-1}
										disableRipple
									/>
								</ListItemIcon>
								<ListItemText primary={toDoItem.title} />
							</ListItemButton>


						</ListItem>
						<Divider />
					</React.Fragment>
				))}
			</List>



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
