import { useEffect, useState } from 'react'
import {
	Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl,
	FormControlLabel, FormGroup, Grid, IconButton, InputAdornment, InputLabel, MenuItem, Select, TextField,
	Typography
} from '@mui/material'

// Icons
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import DeleteIcon from '@mui/icons-material/Delete';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

import { useMutation, useQuery } from '@apollo/client'
import { useGlobalContext } from '../pages/App/GlobalContextProvider'
import { Controller, useForm } from 'react-hook-form'


import { currentYYYYMMDD } from './DateFunctions'

// Qureries
import { EDIT_RITUAL_DIALOG_QUERY } from '../models/ritual'

// Mutations
import { DELETE_RITUAL, UPDATE_RITUAL } from '../models/ritual'
import { UPDATE_SCHEDULE } from '../models/schedule'


interface IFormInput {
	title: string;
	ritualItems: string;

	// Schedule
	id: string;
	repeat: string;
	schedule: string;
	timeOfDay: string;
	recurrenceRule: string;
	reminderBeforeEvent: string;
	description: string;
	objectId: string;
	selectedDays: { [key: string]: boolean };
}

interface EditRitualDialogProps {
	id: string;
	title: string;
	handleClose: () => void;
}


const EditRitualDialog = (props: EditRitualDialogProps) => {
	const { setSnackbar } = useGlobalContext();

	const [scheduleUpdated, setScheduleUpdated] = useState(false);
	const [ritualUpdated, setRitualUpdated] = useState(false);
	const [ritualItems, setRitualItems] = useState<Array<{ id: string; title: string }>>([]);

	const { data, loading, error } = useQuery(EDIT_RITUAL_DIALOG_QUERY, {
		variables: {
			id: props.id,
			yearMonth: currentYYYYMMDD().slice(0, 7),
		},
		fetchPolicy: "network-only",
		onCompleted: (data) => {

			setValue('title', data.ritual.title);
			setRitualItems(JSON.parse(data.ritual.ritualItems || '[]'));

			const scheduleData = data.ritual.schedules[0];
			setValue('timeOfDay', scheduleData.timeOfDay || '');
			setValue('description', scheduleData.description || '');

			// Parse the recurrenceRule to set the schedule and selectedDays
			if (!scheduleData.recurrenceRule) {
				setValue('schedule', 'No Schedule');
			} else if (scheduleData.recurrenceRule.includes('FREQ=DAILY')) {
				setValue('schedule', 'Daily');
			} else if (scheduleData.recurrenceRule.includes('FREQ=WEEKLY')) {
				setValue('schedule', 'Weekly');
				const dayMapping: { [key: string]: string } = {
					MO: "Monday",
					TU: "Tuesday",
					WE: "Wednesday",
					TH: "Thursday",
					FR: "Friday",
					SA: "Saturday",
					SU: "Sunday",
				};
				const rruleParts = scheduleData.recurrenceRule.split(';');
				const byDayValue = rruleParts.find((part: string) => part.startsWith('BYDAY'))?.split('=')[1] || '';
				const selectedDays = byDayValue.split(',').reduce((acc: { [key: string]: boolean }, dayAbbrev: string) => {
					const dayName = dayMapping[dayAbbrev];
					if (dayName) {
						acc[dayName] = true;
					}
					return acc;
				}, {
					"Monday": false,
					"Tuesday": false,
					"Wednesday": false,
					"Thursday": false,
					"Friday": false,
					"Saturday": false,
					"Sunday": false,
				});
				setValue('selectedDays', selectedDays);
			}
		}
	});


	const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];


	const [deleteRitual] = useMutation(DELETE_RITUAL);
	const handleDelete = () => {
		deleteRitual({
			variables: {
				ritualId: props.id,
			},
			onCompleted: () => {
				props.handleClose();
			},
		});
	};


	const [updateRitual] = useMutation(UPDATE_RITUAL, {
		onCompleted: () => {
			setSnackbar({ open: true, message: "Ritual updated", severity: "success" });
		},
		onError: (error) => {
			console.log(error)
			setSnackbar({ open: true, message: "Error updating ritual", severity: "error" });
		}
	});

	const [updateSchedule] = useMutation(UPDATE_SCHEDULE, {
		onCompleted: () => props.handleClose(),
		onError: (error) => {
			console.log(error)
			setSnackbar({ open: true, message: "Error updating schedule", severity: "error" });
		}
	});

	const onSubmit = (formData: IFormInput) => {

		// Update Ritual
		updateRitual({
			variables: {
				id: props.id,
				title: watch('title'),
				checkedItems: "[]",
				ritualItems: JSON.stringify(ritualItems),
			},
			onCompleted: () => setRitualUpdated(true),
		});

		// Update Schedule
		let recurrenceRule = '';
		switch (formData.schedule) {
			case 'No Schedule':
				recurrenceRule = ''; // No RRULE needed
				break;
			case 'Daily':
				recurrenceRule = 'FREQ=DAILY'; // RRULE for daily recurrence
				break;
			case 'Weekly':
				const selectedDays = formData.selectedDays;
				const daysAbbrev = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];
				const rruleDays = days.map((day, index) => selectedDays[day] ? daysAbbrev[index] : null).filter(day => day !== null).join(',');
				recurrenceRule = `FREQ=WEEKLY;BYDAY=${rruleDays}`; // RRULE for weekly recurrence on selected days
				break;
		}

		updateSchedule({
			variables: {
				id: data.ritual.schedules[0].id,
				recurrenceRule: recurrenceRule,
			},
			onCompleted: () => setScheduleUpdated(true),
			refetchQueries: [{ query: EDIT_RITUAL_DIALOG_QUERY, variables: { id: props.id, yearMonth: currentYYYYMMDD().slice(0, 7), } }]
		});
	};

	useEffect(() => {
		if (scheduleUpdated && ritualUpdated) {
			props.handleClose();
		}
	}, [scheduleUpdated, ritualUpdated]);

	const { control, handleSubmit, setValue, watch } = useForm<IFormInput>({
		defaultValues: {
			title: '',
			repeat: '',
			schedule: 'No Schedule',
			timeOfDay: '',
			recurrenceRule: '',
			reminderBeforeEvent: '',
			description: '',
			objectId: '',
			selectedDays: {
				"Monday": false,
				"Tuesday": false,
				"Wednesday": false,
				"Thursday": false,
				"Friday": false,
				"Saturday": false,
				"Sunday": false,
			},
		}
	});

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error :(</p>;

	console.log(ritualItems)



	return (
		<Dialog open={true} onClose={() => props.handleClose()} fullWidth maxWidth="md">

			{/* Dialog Title */}
			<DialogTitle>
				Edit Ritual
			</DialogTitle>


			<form onSubmit={handleSubmit(onSubmit)}>
				{/* Dialog Content */}
				<DialogContent>

					<Grid container spacing={2}>

						{/* Ritual Stuff */}
						<Grid item xs={6}>
							{/* Ritual Title */}
							<Controller
								name="title"
								control={control}
								defaultValue=""
								render={({ field }) => (
									<TextField
										{...field}
										margin="dense"
										id="title"
										label="Ritual Title"
										type="text"
										fullWidth
										variant="outlined"
										InputLabelProps={{
											shrink: true,
										}}
									/>
								)}
							/>

							{/* Ritual Items */}
							<Grid item xs={12}>
								<Typography variant="subtitle1">Ritual Items:</Typography>
								{ritualItems.map((item, index) => (
									<Grid container key={item.id} alignItems="center" spacing={1}>
										<Grid item>
											{item.id.startsWith('h') ? (
												<TextField
													value={item.title}
													onChange={(e) => {
														const updatedItems = [...ritualItems];
														updatedItems[index] = { ...item, title: e.target.value };
														setRitualItems(updatedItems);
													}}
													margin="dense"
													variant="outlined"
													fullWidth
													InputProps={{
														startAdornment: (
															<InputAdornment position="start">
																<FavoriteBorderIcon color='primary' />
															</InputAdornment>
														),
													}}
												/>
											) : (
												<TextField
													value={item.title}
													onChange={(e) => {
														const updatedItems = [...ritualItems];
														updatedItems[index] = { ...item, title: e.target.value };
														setRitualItems(updatedItems);
													}}
													margin="dense"
													variant="outlined"
													fullWidth
													InputProps={{
														startAdornment: (
															<InputAdornment position="start">
																<FavoriteBorderIcon color='error' />
															</InputAdornment>
														),
													}}
												/>
											)}
										</Grid>
										<Grid item>
											<IconButton
												onClick={() => {
													const updatedItems = [...ritualItems];
													updatedItems.splice(index, 1);
													setRitualItems(updatedItems);
												}}
											>
												<DeleteIcon />
											</IconButton>
										</Grid>
										{index > 0 && (
											<Grid item>
												<IconButton
													onClick={() => {
														const updatedItems = [...ritualItems];
														const temp = updatedItems[index - 1];
														updatedItems[index - 1] = updatedItems[index];
														updatedItems[index] = temp;
														setRitualItems(updatedItems);
													}}
												>
													<ArrowUpwardIcon />
												</IconButton>
											</Grid>
										)}
									</Grid>
								))}
								<Button
									onClick={() => setRitualItems([...ritualItems, { id: `i${Date.now()}`, title: '' }])}
									variant="contained"
									color="primary"
								>
									Add Item
								</Button>
							</Grid>
						</Grid>



						{/* Schedule Section */}
						<Grid item xs={6}>
							{/* Repeat */}
							<Controller
								name="schedule"
								control={control}
								defaultValue=""
								render={({ field }) => (
									<FormControl fullWidth margin="normal">
										<InputLabel id="schedule">Schedule</InputLabel>
										<Select
											{...field}
											labelId="schedule"
											label="Schedule"
										>
											<MenuItem value="No Schedule">No Schedule</MenuItem>
											<MenuItem value="Daily">Daily</MenuItem>
											<MenuItem value="Weekly">Weekly</MenuItem>
											<MenuItem value="Monthly">Monthly</MenuItem>
											<MenuItem value="Yearly">Yearly</MenuItem>
										</Select>
									</FormControl>
								)}
							/>

							{/* Weekly selector */}
							{watch('schedule') === 'Weekly' && (
								<FormGroup row>
									{days.map((day) => (
										<FormControlLabel
											control={
												<Controller
													name={`selectedDays.${day}`}
													control={control}
													render={({ field }) => (
														<Checkbox
															{...field}
															checked={watch(`selectedDays.${day}`)}
															onChange={(e) => field.onChange(e.target.checked)}
														/>
													)}
												/>
											}
											label={day}
											key={day}
										/>
									))}
								</FormGroup>
							)}

							{/* Monthly selector */}

							{/* Divider */}
							<Divider sx={{ my: 2 }} />


							{/* Time of Day */}
							{watch('schedule') !== 'No Schedule' && (
								<Controller
									name="timeOfDay"
									control={control}
									defaultValue=""
									render={({ field }) => (
										<TextField
											{...field}
											label="Time of Day"
											type="time"
											margin="dense"
											fullWidth
											variant="outlined"
											InputLabelProps={{
												shrink: true,
											}}
										/>
									)}
								/>
							)}


							{/* Reminder Before Event */}
							{watch('schedule') !== 'No Schedule' && (
								<Controller
									name="reminderBeforeEvent"
									control={control}
									defaultValue=""
									render={({ field }) => (
										<TextField
											{...field}
											label="Reminder Before Event"
											margin="dense"
											fullWidth
											variant="outlined"
										/>
									)}
								/>
							)}

							{/* Description */}
							{watch('schedule') !== 'No Schedule' && (
								<Controller
									name="description"
									control={control}
									defaultValue=""
									render={({ field }) => (
										<TextField
											{...field}
											label="Description"
											margin="dense"
											fullWidth
											multiline
											rows={4}
											variant="outlined"
										/>
									)}
								/>
							)}
						</Grid>

					</Grid>

				</DialogContent>

				{/* Dialog Actions */}
				<DialogActions>
					<Button
						onClick={() => props.handleClose()}
						color="primary"
						variant="contained"
					>
						Cancel
					</Button>
					<Button type='submit' color="primary" variant="contained">
						Save
					</Button>
				</DialogActions>

			</form>
		</Dialog>
	)
}

export default EditRitualDialog