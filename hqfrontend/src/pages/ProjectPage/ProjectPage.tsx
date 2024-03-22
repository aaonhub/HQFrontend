import { useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useMutation } from '@apollo/client'
import { Box, Typography, TextField, List, Container } from '@mui/material'
import { ReactSortable, SortableEvent } from "react-sortablejs"

// Components
import EditInboxItemDialog from '../../components/EditToDoItemDialog'
import ProjectToDoItem from './components/ProjectToDoItem'

// Icons
import IconButton from '@mui/material/IconButton'
import ArrowBack from '@mui/icons-material/ArrowBack'

// Queries and Mutations
import {
	GET_PROJECT_ITEMS,
	CREATE_TO_DO_AND_ADD_TO_PROJECT_AT_POSITION,
	UPDATE_PROJECT_ITEM_ORDER
} from '../../models/project'
import {
	CHECK_UNCHECK_TODO,
} from '../../models/inboxitem'

// Models
import Project from '../../models/project'
import InboxItem from '../../models/inboxitem'
import { useGlobalContext } from '../App/GlobalContextProvider'
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@radix-ui/react-context-menu'


const ProjectPage = () => {
	const { projectId } = useParams()
	const { setSnackbar } = useGlobalContext()

	const [project, setProject] = useState<Project>(new Project('', ''))
	const [selectedInboxItem, setSelectedInboxItem] = useState<InboxItem>()
	const [projectItemArray, setProjectItemArray] = useState<InboxItem[]>([])

	const newTopProjectItemTitleRef = useRef<HTMLInputElement>(null)
	const newBottomProjectItemTitleRef = useRef<HTMLInputElement>(null)


	// Project Query
	const { data, loading, error, refetch } = useQuery(GET_PROJECT_ITEMS, {
		variables: { projectId, completed: false },
		onCompleted: (data) => {
			handleDataCompleted(data)
		},
		onError: (error) => console.log(error.networkError),
	})

	const handleDataCompleted = (data: any) => {

		// Define the project items
		const projectItems = data.project.toDoItems?.map((item: any) =>
			new InboxItem({
				id: item.id,
				title: item.title,
				description: item.description,
				completed: item.completed,
				project: item.project,
				dueDateTime: item.due_date_time ? item.due_date_time : "",
				startDate: item.start_date,
				startTime: item.start_time,
				timeCompleted: item.time_completed ? new Date(item.time_completed) : null,
			})
		) || []

		let item_order: string[] = []
		try {
			item_order = JSON.parse(data.project.itemOrder)
		} catch (error) {
			console.error('Failed to parse itemOrder:', data.project.itemOrder)
			item_order = []
		}

		// Items with order and without
		const orderedItems = item_order.map((itemId: string) => {
			return projectItems.find((item: any) => item.id === itemId)
		}).filter((item: any) => item !== undefined) as InboxItem[]
		const unorderedItems = projectItems.filter((item: any) => !item_order.includes(item.id))

		// Combine ordered and unordered items
		const finalItems = orderedItems.concat(unorderedItems)

		changeProjectItemOrder({
			variables: {
				id: data.project.id,
				itemOrder: finalItems.map((item: InboxItem) => item.id),
			},
		})

		const project: Project = {
			id: data.project.id,
			codename: data.project.codename,
			to_do_items: finalItems,
			item_order: item_order,
		}

		setProject(project)
		project.to_do_items
			? setProjectItemArray(finalItems)
			: setProjectItemArray([])
	}

	const doRefetch = () => {
		refetch().then(({ data }) => handleDataCompleted(data));
	};


	// Add Project Item
	const [addItemToProjectAtPosition] = useMutation(CREATE_TO_DO_AND_ADD_TO_PROJECT_AT_POSITION, {
		onError: (error) => console.log(error.networkError),
		onCompleted: () => {
			console.log('Project Item Added')
			if (newTopProjectItemTitleRef.current) {
				newTopProjectItemTitleRef.current.value = ''
			}
			if (newBottomProjectItemTitleRef.current) {
				newBottomProjectItemTitleRef.current.value = ''
			}
			setSnackbar({ open: true, message: 'Project Item Added', severity: 'success' })
			doRefetch()
		}
	})
	const handleAddProjectItemTop = (position: number) => {
		addItemToProjectAtPosition({
			variables: {
				title: newTopProjectItemTitleRef.current && newTopProjectItemTitleRef.current.value,
				projectId: projectId,
				position: position,
			},
		})
	}
	const handleAddProjectItemBottom = (position: number) => {
		addItemToProjectAtPosition({
			variables: {
				title: newBottomProjectItemTitleRef.current && newBottomProjectItemTitleRef.current.value,
				projectId: projectId,
				position: position,
			},
		})
	}




	// Check off to do item
	const [completeToDoItem] = useMutation(CHECK_UNCHECK_TODO, {
		onCompleted: () => {
			doRefetch()
		},
		onError: (error) => console.log(error.networkError),
	})
	const handleCheck = (toDoItem: InboxItem) => () => {
		completeToDoItem({
			variables: {
				id: toDoItem.id,
				Completed: !toDoItem.completed,
			},
		})
	}


	const handleProjectItemOrderChangeComplete = (evt: SortableEvent) => {
		const newIndex = evt.newIndex
		const oldIndex = evt.oldIndex

		if (typeof newIndex === 'undefined' || typeof oldIndex === 'undefined') {
			return
		}

		const newProjectItemArray = [...projectItemArray]
		const movedItem = newProjectItemArray.splice(oldIndex, 1)[0]
		newProjectItemArray.splice(newIndex, 0, movedItem)

		setProjectItemArray(newProjectItemArray)

		const itemOrder = newProjectItemArray.map((item) => item.id)

		changeProjectItemOrder({
			variables: {
				id: projectId,
				itemOrder: itemOrder,
			},
		})
	}
	const [changeProjectItemOrder] = useMutation(UPDATE_PROJECT_ITEM_ORDER, {
		onError: (error) => console.log(error.networkError),
	})




	// Edit to do item
	const handleClose = () => {
		setSelectedInboxItem(undefined)
		doRefetch()
	}






	if (loading) { return <div>Loading...</div> }
	if (error) { return <div>Error! {error.message}</div> }

	return (
		<Container maxWidth="xl">

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
				inputRef={newTopProjectItemTitleRef}
				fullWidth
				label="Add Project Item"
				defaultValue=""
				autoComplete="off"
				onChange={(e) => {
					if (newTopProjectItemTitleRef.current) {
						newTopProjectItemTitleRef.current.value = e.target.value
					}
				}}
				variant="outlined"
				size="small"
				onKeyDown={(e) => {
					if (e.key === 'Enter') {
						handleAddProjectItemTop(0)
					}
				}}
				sx={{ marginBottom: 2 }}
			/>


			{/* To-Do Items */}
			<ContextMenu>
				<List sx={{ width: '100%', marginBottom: 2 }}>
					<ReactSortable
						list={projectItemArray}
						setList={setProjectItemArray}
						group="groupName"
						animation={50}
						delayOnTouchOnly={true}
						delay={1}
						swapThreshold={.9}
						onEnd={handleProjectItemOrderChangeComplete}
					>
						{projectItemArray.map((toDoItem) =>
							<ContextMenuTrigger>
								<ProjectToDoItem
									toDoItem={toDoItem}
									handleCheck={handleCheck}
									setSelectedInboxItem={setSelectedInboxItem}
									refetch={doRefetch}
									key={toDoItem.id}
								/>
							</ContextMenuTrigger>
						)}
					</ReactSortable>
				</List>

				<ContextMenuContent className="w-64">
					{/* Back */}
					<ContextMenuItem>
						Back
					</ContextMenuItem>
					{/* Forward */}
					<ContextMenuItem disabled>
						Forward
					</ContextMenuItem>
					{/* Reload */}
					<ContextMenuItem>
						Reload
					</ContextMenuItem>
				</ContextMenuContent>
				
			</ContextMenu>




			{/* Text input that adds to do list items to the project */}
			<TextField
				inputRef={newBottomProjectItemTitleRef}
				fullWidth
				label="Add Project Item"
				defaultValue=""
				autoComplete="off"
				onChange={(e) => {
					if (newBottomProjectItemTitleRef.current) {
						newBottomProjectItemTitleRef.current.value = e.target.value
					}
				}}
				variant="outlined"
				size="small"
				onKeyDown={(e) => {
					if (e.key === 'Enter') {
						handleAddProjectItemBottom(projectItemArray.length)
					}
				}}
				sx={{ marginBottom: 2 }}
			/>




			{/* dialog */}
			{selectedInboxItem && <EditInboxItemDialog handleClose={handleClose} inboxItemId={selectedInboxItem.id} />}



		</Container >
	)
}

export default ProjectPage
