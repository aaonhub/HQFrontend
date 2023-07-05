import React, { useEffect, useState } from "react"
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
	Button,
	Box,
	Checkbox,
	FormControlLabel,
	Select,
	MenuItem,
	SelectChangeEvent,
	InputLabel,
	Grid
} from "@mui/material"
import { useMutation, useQuery } from "@apollo/client"

// Components
import { useGlobalContext } from "../pages/App/GlobalContextProvider"

// Models
import InboxItem from "../models/inboxitem"
import Project from "../models/project"

// Queries and Mutations
import { UPDATE_TODO } from "../models/inboxitem"
import { GET_INBOX_TODO } from "../models/inboxitem"
import { DELETE_TODO } from "../models/inboxitem"
import { GET_PROJECTS } from "../models/project"


interface ProjectToDoItemProps {
	handleClose: () => void
	inboxItemId: string
}

const EditInboxItemDialog = React.memo(({ handleClose, inboxItemId }: ProjectToDoItemProps) => {
	const { setSnackbar } = useGlobalContext()

	// State
	const [newInboxItem, setNewInboxItem] = useState(new InboxItem({
		id: '',
		title: '',
		description: '',
		completed: false,
		project: null,
		dueDateTime: null,
		startDate: null,
		startTime: null,
		timeCompleted: null,
		length: null,
	}))
	const [projects, setProjects] = useState<Project[]>([])
	const [showCustomInput, setShowCustomInput] = useState(false);
	const [customLength, setCustomLength] = useState<string>("");



	// InboxItem Query
	const { loading, error } = useQuery(GET_INBOX_TODO, {
		variables: { id: inboxItemId },
		fetchPolicy: "network-only",
		onCompleted: (data) => {
			const project = data.toDoItem.project ? new Project(
				data.toDoItem.project.id,
				data.toDoItem.project.codename
			) : null
			setNewInboxItem(
				new InboxItem({
					id: data.toDoItem.id,
					title: data.toDoItem.title,
					description: data.toDoItem.description,
					completed: data.toDoItem.completed,
					project: project,
					dueDateTime: data.toDoItem.dueDateTime ? new Date(data.toDoItem.dueDateTime).toISOString().slice(0, 16) : "",
					startDate: data.toDoItem.startDate,
					startTime: data.toDoItem.startTime,
					timeCompleted: data.toDoItem.timeCompleted,
				})
			)

			if (data.toDoItem.length) {
				setCustomLength(data.toDoItem.length)
			}
			if (data.toDoItem.length === null) {
				setNewInboxItem(prev => ({
					...prev,
					length: "01:00"
				}));
			} else if (!['00:15', '00:30', '00:45', '01:00', '02:00', '03:00'].includes(data.toDoItem.length)) {
				setShowCustomInput(true);
				setNewInboxItem(prev => ({
					...prev,
					length: 'custom'
				}));
			} else {
				setShowCustomInput(false);
				setNewInboxItem(prev => ({
					...prev,
					length: data.toDoItem.length
				}));
			}

		},
		onError: (error) => {
			console.log(error)
			console.log(inboxItemId)
		}
	})

	// Project Query
	const { loading: projectLoading, error: projectError, data: projectData } = useQuery(GET_PROJECTS, {
		fetchPolicy: "network-only",
		onCompleted: (data) => {
			setProjects(data.projects.map((project: Project) => new Project(
				project.id,
				project.codename
			)))
		}
	})



	// InboxItem Update
	const [updateInboxItem] = useMutation(UPDATE_TODO)
	const handleSave = () => {

		const dueDateTime = newInboxItem.dueDateTime ? new Date(newInboxItem.dueDateTime) : null
		const length = showCustomInput ? customLength : newInboxItem.length

		// Ensure length is a string before testing
		const lengthString = length || '';

		// Check if length is in the "hh:mm" format
		if (!/^([0-1][0-9]|[2][0-3]):([0-5][0-9])$/.test(lengthString)) {
			// Length is not in "hh:mm" format. Notify the user.
			setSnackbar({
				open: true,
				message: "Please enter length in 'hh:mm' format",
				severity: "error",
			});
			return;
		}

		try {
			updateInboxItem({
				variables: {
					ID: newInboxItem.id,
					Title: newInboxItem.title,
					Description: newInboxItem.description,
					StartDate: newInboxItem.startDate,
					StartTime: newInboxItem.startTime,
					DueDateTime: dueDateTime,
					ProjectId: newInboxItem.project ? newInboxItem.project.id : null,
					Completed: newInboxItem.completed,
					Length: length,
				},
				onCompleted: () => {
					setSnackbar({
						open: true,
						message: "Inbox Item Updated",
						severity: "success",
					})
					handleClose()
				}
			})
		} catch (error) {
			console.log(error)
		}
	}



	// InboxItem Delete
	const [deleteInboxItem] = useMutation(DELETE_TODO)
	const handleDelete = () => {
		try {
			deleteInboxItem({
				variables: {
					id: inboxItemId,
				},
				onCompleted: () => {
					handleClose()
					setSnackbar({
						open: true,
						message: "Inbox Item Deleted",
						severity: "success",
					})
				}
			})
		} catch (error) {
			console.log(error)
		}
	}


	// Input Change Logic
	const handleInputChange = (e: React.ChangeEvent<{ name?: string; value: string }>) => {
		const { name, value } = e.target;
		if (!name) return;  // handle the case where name might be undefined

		setNewInboxItem((prev) => {
			if (name === 'length') {
				// check if the custom option was selected
				if (value === 'custom') {
					setShowCustomInput(true);
				} else {
					setShowCustomInput(false);
				}

				return { ...prev, [name]: value };
			}

			if (name === 'startTime') {
				return { ...prev, [name]: value === '' ? null : value + ":00" }
			}

			const updatedValue = name === 'startDate' || name === 'dueDateTime'
				? value === '' ? null : value
				: value;

			return { ...prev, [name]: updatedValue }
		});
	};
	const handleSelectChange = (event: SelectChangeEvent) => {
		const { name, value } = event.target
		const selectedProject = projects.find(project => project.id === value)
		setNewInboxItem((prev) => ({ ...prev, [name]: selectedProject }))
	}



	if (projectLoading) return <p>Loading projects...</p>
	if (projectError) return <p>Error loading projects :(</p>

	if (loading) return <p>Loading...</p>
	if (error) return <p>Error :(</p>

	return (
		<Dialog
			open={true}
			onClose={() => handleClose()}
			maxWidth="lg"
			fullWidth
		>
			<DialogTitle>Edit To Do Item</DialogTitle>
			<DialogContent>
				<Box
					component="form"
					noValidate
					autoComplete="off"
					onSubmit={(e) => {
						e.preventDefault()
						handleClose()
					}}
				>
					<Grid container spacing={2}>
						<Grid item xs={6} sm={6}>

							{/* Title */}
							<Box m={2}>
								<TextField
									name="title"
									label="Title"
									variant="outlined"
									value={newInboxItem.title}
									onChange={handleInputChange}
									sx={{ width: "60ch" }}
								/>
							</Box>

							{/* Description */}
							<Box m={2}>
								<TextField
									name="description"
									label="Description"
									variant="outlined"
									value={newInboxItem.description}
									onChange={handleInputChange}
									multiline
									minRows={12}
									maxRows={24}
									fullWidth
								/>
							</Box>

						</Grid>


						<Grid item xs={6} sm={6}>
							<Box m={2}>


								{/* Completed */}
								<Box m={2}>
									<FormControlLabel
										control={
											<Checkbox
												checked={newInboxItem.completed}
												onChange={(event) => {
													const { checked } = event.target
													setNewInboxItem((prev) => {
														return { ...prev, completed: checked }
													})
												}}
											/>
										}
										label="Completed"
									/>
								</Box>

								{/* Start Date */}
								<TextField
									name="startDate"
									label="Start Date"
									type="date"
									variant="outlined"
									InputLabelProps={{
										shrink: true,
									}}
									sx={{ marginRight: "2ch" }}
									value={newInboxItem.startDate ? newInboxItem.startDate : ''}
									onChange={handleInputChange}
								/>
							</Box>

							{/* Due Date */}
							<Box m={2}>
								<TextField
									name="dueDateTime"
									label="Due Date"
									type="datetime-local"
									variant="outlined"
									InputLabelProps={{
										shrink: true,
									}}
									sx={{ marginRight: "2ch" }}
									value={newInboxItem.dueDateTime}
									onChange={handleInputChange}
								/>
							</Box>

							{/* Start Date */}
							<Box m={2}>
								<TextField
									name="startTime"
									label="Start Time"
									type="time"
									variant="outlined"
									InputLabelProps={{
										shrink: true,
									}}
									sx={{ marginRight: "2ch" }}
									value={newInboxItem.startTime ? newInboxItem.startTime : ''}
									onChange={handleInputChange}
								/>
							</Box>


							{/* Project */}
							<Box m={2}>
								<Select
									name="project"
									value={newInboxItem.project ? newInboxItem.project.id : ''}
									onChange={handleSelectChange}
									displayEmpty
								>
									<MenuItem value="" disabled>
										Select a project
									</MenuItem>
									{projectData.projects.map((project: any) => (
										<MenuItem value={project.id} key={project.id}>
											{project.codename}
										</MenuItem>
									))}
								</Select>
							</Box>


							{/* Length */}
							<Box m={2}>
								<InputLabel id="length-label">Length</InputLabel>
								<Select
									name="length"
									value={newInboxItem.length ? newInboxItem.length : ''}
									onChange={handleInputChange as any}
								>
									<MenuItem value="00:15">15 minutes</MenuItem>
									<MenuItem value="00:30">30 minutes</MenuItem>
									<MenuItem value="00:45">45 minutes</MenuItem>
									<MenuItem value="01:00">1 hour</MenuItem>
									<MenuItem value="02:00">2 hours</MenuItem>
									<MenuItem value="03:00">3 hours</MenuItem>
									<MenuItem value="custom">Custom</MenuItem>
								</Select>
								{showCustomInput && (
									<TextField
										value={customLength}
										onChange={(e) => {
											setCustomLength(e.target.value);
										}}
									/>
								)}
							</Box>

						</Grid>
					</Grid>



				</Box>
			</DialogContent>
			<DialogActions>
				<Button onClick={() => handleDelete()} color="error">
					Delete
				</Button>
				<Button onClick={() => handleClose()} color="primary">
					Cancel
				</Button>
				<Button onClick={() => handleSave()} color="primary">
					Save
				</Button>
			</DialogActions>
		</Dialog>
	)
})

export default EditInboxItemDialog
