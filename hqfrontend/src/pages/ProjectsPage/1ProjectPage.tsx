import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { Box, Typography, Fab, TextField, List } from '@mui/material';
import ProjectToDoItem from './3ProjectToDoItem';
import EditInboxItemDialog from '../../components/EditInboxItemDialog';
import { ReactSortable, SortableEvent } from "react-sortablejs"

// Icons
import { Add } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import ArrowBack from '@mui/icons-material/ArrowBack';

// Queries and Mutations
import { GET_INCOMPLETE_PROJECT_ITEMS } from '../../models/project';
import { CREATE_TO_DO_AND_ADD_TO_PROJECT } from '../../models/project';
import { UPDATE_TODO } from '../../models/inboxitem';
import { ADD_LOG } from '../../models/log';
import { UPDATE_PROJECT_ITEM_ORDER } from '../../models/project';

// Models
import Project from '../../models/project';
import InboxItem, { COMPLETE_UNCOMPLETE_TODO } from '../../models/inboxitem';


const ProjectPage = () => {
	const { projectId } = useParams();
	const [newProjectItemTitle, setNewProjectItemTitle] = useState('')
	const [project, setProject] = useState<Project>(new Project('', ''))
	const [selectedInboxItem, setSelectedInboxItem] = useState<InboxItem>()
	const [projectItemArray, setProjectItemArray] = useState<InboxItem[]>([])


	// Project Query
	const { loading, error, refetch } = useQuery(GET_INCOMPLETE_PROJECT_ITEMS, {
		variables: { id: projectId },
		onCompleted: (data) => {
			const projectData = data.project.data;
			const item_order = projectData.attributes.ItemOrder || [];
			const projectItems = projectData.attributes.to_do_items?.data?.map(
				(item: any) => new InboxItem({
					id: item.id,
					title: item.attributes.Title,
					completed: item.attributes.Completed,
					project: item.attributes.Project,
					dueDate: new Date(item.attributes.DueDate),
					description: item.attributes.Description,
					startDate: new Date(item.attributes.StartDate),
					startTime: new Date(item.attributes.StartTime),
					timeCompleted: new Date(item.attributes.TimeCompleted),
				})
			) || [];

			const orderedItems = item_order.map((itemId: string) => {
				return projectItems.find((item: InboxItem) => item.id === itemId);
			}).filter((item: InboxItem | undefined) => item !== undefined) as InboxItem[];

			const unorderedItems = projectItems.filter((item: InboxItem) => !item_order.includes(item.id));

			const finalItems = orderedItems.concat(unorderedItems);

			changeProjectItemOrder({
				variables: {
					id: projectId,
					data: {
						ItemOrder: finalItems.map((item: InboxItem) => item.id),
					},
				},
			});

			const project: Project = {
				id: projectData.id,
				codename: projectData.attributes.Codename,
				to_do_items: finalItems,
				item_order: item_order,
			};

			setProject(project);
			project.to_do_items
				? setProjectItemArray(finalItems)
				: setProjectItemArray([]);
		},

	});




	// Add Inbox Item
	const [addItemToProject] = useMutation(CREATE_TO_DO_AND_ADD_TO_PROJECT, {
		onError: (error) => console.log(error.networkError),
		onCompleted: () => {
			setNewProjectItemTitle('')
			refetch()
		},
	});
	const handleAddProjectItem = () => {
		addItemToProject({
			variables: {
				Title: newProjectItemTitle,
				projectid: projectId,
			},
		});

	};




	// Check off to do item
	const [completeToDoItem] = useMutation(COMPLETE_UNCOMPLETE_TODO, {
		onError: (error) => console.log(error.networkError),
		onCompleted: () => {
			console.log('completed')
		},
	});
	const [addLog] = useMutation(ADD_LOG, {
		onError: (error) => console.log(error.networkError),
	});
	const handleCheck = (toDoItem: InboxItem) => () => {
		completeToDoItem({
			variables: {
				id: toDoItem.id,
				Completed: !toDoItem.completed,
			},
		});
		addLog({
			variables: {
				Log: `Completed "${toDoItem.title}" in project "${project.codename}"`,
				LogTime: new Date().toISOString(),
				Type: 'todoitem',
			},
		});
	};




	// Edit to do item
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
			const index = projectItemArray.findIndex(item => item.id === inboxItem.id);
			if (index) {
				const updatedProjectItemArray = [...projectItemArray];
				updatedProjectItemArray.splice(index, 1, inboxItem);
				setProjectItemArray(updatedProjectItemArray);
			}
			handleUpdateToDo(inboxItem);
			setSelectedInboxItem(undefined);
		}
		else {
			setSelectedInboxItem(undefined);
		}
	};




	// Change order of to do items
	const [changeProjectItemOrder] = useMutation(UPDATE_PROJECT_ITEM_ORDER, {
		onError: (error) => console.log(error.networkError),
		onCompleted: (data) => {
			console.log(data)
		},
	});
	const handleProjectItemOrderChangeComplete = (evt: SortableEvent) => {
		const newIndex = evt.newIndex;
		const oldIndex = evt.oldIndex;

		if (typeof newIndex === 'undefined' || typeof oldIndex === 'undefined') {
			return;
		}

		const newProjectItemArray = [...projectItemArray];
		const movedItem = newProjectItemArray.splice(oldIndex, 1)[0];
		newProjectItemArray.splice(newIndex, 0, movedItem);

		setProjectItemArray(newProjectItemArray);

		const itemOrder = newProjectItemArray.map((item) => item.id);

		changeProjectItemOrder({
			variables: {
				id: projectId,
				data: {
					ItemOrder: itemOrder,
				},
			},
		});
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
				value={newProjectItemTitle}
				onChange={(e) => setNewProjectItemTitle(e.target.value)}
				variant="outlined"
				size="small"
				onKeyDown={(e) => {
					if (e.key === 'Enter') {
						handleAddProjectItem();
					}
				}}
			/>



			{/* To-Do Items */}
			<List sx={{ width: '100%', bgcolor: 'background.paper' }}>
				<ReactSortable
					list={projectItemArray}
					setList={setProjectItemArray}
					onEnd={handleProjectItemOrderChangeComplete}
				>
					{projectItemArray.map((toDoItem) =>
						<ProjectToDoItem
							toDoItem={toDoItem}
							handleCheck={handleCheck}
							setSelectedInboxItem={setSelectedInboxItem}
							key={toDoItem.id}
						/>
					)}
				</ReactSortable>
			</List>



			{/* dialog */}
			{selectedInboxItem && <EditInboxItemDialog handleClose={handleClose} inboxItem={selectedInboxItem} />}


			{/* Floating Action Button */}
			<Box sx={{ position: 'fixed', bottom: '16px', right: '16px' }}>
				<Fab color="primary" aria-label="add">
					<Add />
				</Fab>
			</Box>


		</Box >
	);
};

export default ProjectPage;
