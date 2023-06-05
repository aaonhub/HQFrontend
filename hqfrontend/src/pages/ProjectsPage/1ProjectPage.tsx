import { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { Box, Typography, Fab, TextField, List } from '@mui/material';
import ProjectToDoItem from './3ProjectToDoItem';
import EditInboxItemDialog from '../../components/EditToDoItemDialog';
import { ReactSortable, SortableEvent } from "react-sortablejs"

// Icons
import { Add } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import ArrowBack from '@mui/icons-material/ArrowBack';

// Queries and Mutations
import { GET_PROJECT_ITEMS } from '../../models/project';
import { CREATE_TO_DO_AND_ADD_TO_PROJECT } from '../../models/project';
import { UPDATE_PROJECT_ITEM_ORDER } from '../../models/project';
import { UPDATE_TODO } from '../../models/inboxitem';
import { ADD_LOG } from '../../models/log';

// Models
import Project from '../../models/project';
import InboxItem, { CHECK_UNCHECK_TODO } from '../../models/inboxitem';


const ProjectPage = () => {
	const { projectId } = useParams();
	const newProjectItemTitleRef = useRef<HTMLInputElement>(null);
	const [project, setProject] = useState<Project>(new Project('', ''))
	const [selectedInboxItem, setSelectedInboxItem] = useState<InboxItem>()
	const [projectItemArray, setProjectItemArray] = useState<InboxItem[]>([])


	// Project Query
	const { loading, error, refetch } = useQuery(GET_PROJECT_ITEMS, {
		variables: { projectId, completed: false },
		onCompleted: (data) => {

			// Define the project items
			const projectItems = data.project.toDoItems?.map((item: any) =>
				new InboxItem({
					id: item.id,
					title: item.title,
					description: item.description,
					completed: item.completed,
					project: item.project,
					dueDateTime: item.due_date_time ? new Date(item.due_date_time) : null,
					startDate: item.start_date,
					startTime: item.start_time,
					timeCompleted: item.time_completed ? new Date(item.time_completed) : null,
				})
			) || [];

			let item_order: string[] = [];
			try {
				item_order = JSON.parse(data.project.itemOrder);
			} catch (error) {
				console.error('Failed to parse itemOrder:', data.project.itemOrder);
				item_order = [];
			}

			// Items with order and without
			const orderedItems = item_order.map((itemId: string) => {
				return projectItems.find((item: any) => item.id === itemId)
			}).filter((item: any) => item !== undefined) as InboxItem[]
			const unorderedItems = projectItems.filter((item: any) => !item_order.includes(item.id));

			// Combine ordered and unordered items
			const finalItems = orderedItems.concat(unorderedItems)

			changeProjectItemOrder({
				variables: {
					id: data.project.id,
					itemOrder: finalItems.map((item: InboxItem) => item.id),
				},
			});

			const project: Project = {
				id: data.project.id,
				codename: data.project.codename,
				to_do_items: finalItems,
				item_order: item_order,
			};

			setProject(project);
			project.to_do_items
				? setProjectItemArray(finalItems)
				: setProjectItemArray([]);
		},
	});



	// Add Project Item
	const [addItemToProject] = useMutation(CREATE_TO_DO_AND_ADD_TO_PROJECT, {
		onError: (error) => console.log(error.networkError),
		onCompleted: () => {
			if (newProjectItemTitleRef.current) {
				newProjectItemTitleRef.current.value = ''
			}
		},
		refetchQueries: [
			{
				query: GET_PROJECT_ITEMS,
				variables: { projectId, completed: false },
			},
		],
	});
	const handleAddProjectItem = () => {
		addItemToProject({
			variables: {
				title: newProjectItemTitleRef.current && newProjectItemTitleRef.current.value,
				projectId: projectId,
			},
		});
	};




	// Check off to do item
	const [completeToDoItem] = useMutation(CHECK_UNCHECK_TODO, {
		onError: (error) => console.log(error.networkError),
		refetchQueries: [
			{
				query: GET_PROJECT_ITEMS,
				variables: { projectId, completed: false },
			},
		],
	});
	const [addToDoLog] = useMutation(ADD_LOG, {
		onError: (error) => console.log(error.networkError),
	});
	const handleCheck = (toDoItem: InboxItem) => () => {
		completeToDoItem({
			variables: {
				id: toDoItem.id,
				Completed: !toDoItem.completed,
			},
		});
		addToDoLog({
			variables: {
				logTime: new Date().toISOString(),
				todoItemId: toDoItem.id,
			},
		});
	};




	// Edit to do item
	const [updateToDo] = useMutation(UPDATE_TODO)
	const handleUpdateToDo = (inboxItem: InboxItem) => {
		console.log(inboxItem)
		updateToDo({
			variables: {
				id: inboxItem.id,
				data: {
					Title: inboxItem.title,
					Description: inboxItem.description,
					Completed: inboxItem.completed,
					DueDateTime: inboxItem.dueDateTime,
					StartDate: inboxItem.startDate,
					StartTime: inboxItem.startTime,
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
				itemOrder: itemOrder,
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
				inputRef={newProjectItemTitleRef}
				fullWidth
				label="Add Project Item"
				defaultValue=""
				onChange={(e) => {
					if (newProjectItemTitleRef.current) {
						newProjectItemTitleRef.current.value = e.target.value;
					}
				}}
				variant="outlined"
				size="small"
				onKeyDown={(e) => {
					if (e.key === 'Enter') {
						handleAddProjectItem();
					}
				}}
				sx={{ marginBottom: 2 }}
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
							refetch={refetch}
							key={toDoItem.id}
						/>
					)}
				</ReactSortable>
			</List>


			{/* Text input that adds to do list items to the project */}
			<TextField
				inputRef={newProjectItemTitleRef}
				fullWidth
				label="Add Project Item"
				defaultValue=""
				onChange={(e) => {
					if (newProjectItemTitleRef.current) {
						newProjectItemTitleRef.current.value = e.target.value;
					}
				}}
				variant="outlined"
				size="small"
				onKeyDown={(e) => {
					if (e.key === 'Enter') {
						handleAddProjectItem();
					}
				}}
				sx={{ marginBottom: 2 }}
			/>



			{/* dialog */}
			{selectedInboxItem && <EditInboxItemDialog handleClose={handleClose} inboxItem={selectedInboxItem} />}

		</Box >
	);
};

export default ProjectPage;
