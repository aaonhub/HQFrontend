import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { List, ListItem, ListItemText, ListItemSecondaryAction, Checkbox, Grid, Paper, TextField, IconButton, Typography, Box, Stack } from '@mui/material';
import { Menu, MenuItem } from '@mui/material';
import { Add, Delete, MoreVert } from '@mui/icons-material';
import { GET_PROJECTS, ADD_TO_DO_TO_PROJECT, CREATE_PROJECT, DELETE_PROJECT } from './projectQueries';


interface Project {
	id: string;
	attributes: {
		Codename: string;
		to_do_items: {
			data: {
				id: string;
				attributes: {
					Title: string;
					Completed: boolean;
				};
			}[];
		};
	};
}

interface ProjectListData {
	projects: {
		data: Project[];
	};
}

const ProjectsPage: React.FC = () => {
	const [selectedProject, setSelectedProject] = useState<Project | null>(null);
	const { loading, error, data, refetch } = useQuery<ProjectListData>(GET_PROJECTS);
	const [updateProject] = useMutation(ADD_TO_DO_TO_PROJECT);
	const [createProject] = useMutation(CREATE_PROJECT);
	const [deleteProject] = useMutation(DELETE_PROJECT);
	const [newProjectName, setNewProjectName] = useState('');
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

	const menuOpen = Boolean(anchorEl);

	const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
	};


	const handleToggleToDoItem = async (projectId: string, toDoItemId: string, completed: boolean) => {
		if (selectedProject) {
			const toDoItems = selectedProject.attributes.to_do_items.data.map((item) =>
				item.id === toDoItemId ? { ...item, attributes: { ...item.attributes, Completed: !completed } } : item,
			);
			const toDoItemIds = toDoItems.map((item) => item.id);
			await updateProject({ variables: { id: projectId, to_do_items: toDoItemIds } });
			setSelectedProject({ ...selectedProject, attributes: { ...selectedProject.attributes, to_do_items: { data: toDoItems } } });
		}
	};

	const handleAddProject = async () => {
		if (newProjectName.trim() !== '') {
			await createProject({
				variables: {
					data: {
						Codename: newProjectName
					}
				}
			});
			setNewProjectName('');
			refetch();
		}
	};

	const handleDeleteProject = async (projectId: string, e: React.MouseEvent) => {
		e.stopPropagation();
		await deleteProject({ variables: { id: projectId } });
		if (selectedProject && selectedProject.id === projectId) {
			setSelectedProject(null);
		}
		refetch();
	};

	console.log('data', data);

	if (loading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>Error! {error.message}</div>;
	}

	return (
		<Box>
			<Typography variant="h3" gutterBottom>
				Projects
			</Typography>

			<Grid container spacing={4}>
				<Grid item xs={12} sm={6}>
					<Paper elevation={1} sx={{ p: 2 }}>
						<Stack spacing={2} mb={2}>
							<TextField
								fullWidth
								label="Add project"
								value={newProjectName}
								variant="standard"
								InputProps={{
									disableUnderline: true,
									sx: {
										'&:hover': {
											'&::before': {
												borderBottom: 'none !important',
											},
										},
										'&::before': {
											borderBottom: 'none !important',
										},
										'&::after': {
											borderBottom: 'none !important',
										},
									},
								}}
								onChange={(e) => setNewProjectName(e.target.value)}
								onKeyDown={(e) => {
									if (e.key === 'Enter') {
										handleAddProject();
									}
								}}
							/>
						</Stack>
						<List>
							{data?.projects?.data?.map((project: Project) => (
								<ListItem
									key={project.id}
									button
									selected={selectedProject?.id === project.id}
									onClick={() => setSelectedProject(project)}
								>
									<ListItemText primary={project.attributes.Codename} />
									<ListItemSecondaryAction>
										<IconButton edge="end" onClick={handleMenuOpen}>
											<MoreVert />
										</IconButton>

										<Menu
											anchorEl={anchorEl}
											open={menuOpen}
											onClose={handleMenuClose}
										>
											<MenuItem onClick={(e) => {
												handleDeleteProject(project.id, e);
												handleMenuClose();

											}}>
												<Delete /> Delete
											</MenuItem>
										</Menu>

									</ListItemSecondaryAction>
								</ListItem>
							))}
						</List>
					</Paper>
				</Grid>



				{selectedProject && (
					<Grid item xs={12} sm={6}>
						<Paper elevation={1} sx={{ p: 2 }}>
							<Typography variant="h5" gutterBottom>
								{selectedProject.attributes.Codename}
							</Typography>

							<List>
								{selectedProject.attributes.to_do_items?.data?.map((toDoItem) => (
									<ListItem key={toDoItem.id} button onClick={() =>
										handleToggleToDoItem(selectedProject.id, toDoItem.id, toDoItem.attributes.Completed)}>
										<ListItemText primary={toDoItem.attributes.Title} />
										<ListItemSecondaryAction>
											<Checkbox
												edge="end"
												checked={toDoItem.attributes.Completed}
												inputProps={{ 'aria-labelledby': `checkbox-list-label-${toDoItem.id}` }}
											/>
										</ListItemSecondaryAction>
									</ListItem>
								))}
							</List>

						</Paper>
					</Grid>
				)}
			</Grid>
		</Box>
	);
};

export default ProjectsPage;