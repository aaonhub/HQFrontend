import React, { useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, MenuItem, Select, InputLabel, FormControl, FormGroup, FormControlLabel, Checkbox, Divider } from '@mui/material';
import { useMutation, useQuery } from '@apollo/client';
import { useForm, Controller } from "react-hook-form";

// Queries and mutations
import { GET_SCHEDULE, UPDATE_SCHEDULE } from '../models/schedule';

interface IFormInput {
	id: string;
	repeat: string;
	schedule: string;
	timeOfDay: string;
	recurrenceRule: string;
	reminderBeforeEvent: string;
	description: string;
	objectId: string;
	selectedDays: { [key: string]: boolean }; // Added for day selection
}

interface EditScheduleDialogProps {
	id: string;
	handleClose: () => void;
}

const EditScheduleDialog = (props: EditScheduleDialogProps) => {

	const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];


	const { data, loading } = useQuery(GET_SCHEDULE, {
		variables: { id: props.id },
		fetchPolicy: "network-only",
		onCompleted: (data) => {
			console.log(data);
		}
	});

	const [updateSchedule] = useMutation(UPDATE_SCHEDULE, {
		onCompleted: () => props.handleClose(),
	});

	const { control, handleSubmit, setValue, watch } = useForm<IFormInput>({
		defaultValues: {
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


	// Parse Data from Query
	useEffect(() => {
		if (!loading && data) {
			const scheduleData = data.getSchedule;
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
			// Add more else if blocks here for other frequencies like Monthly, Yearly, etc.
		}
	}, [data, loading, setValue]);



	const onSubmit = (formData: IFormInput) => {
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

		const updatedFormData = {
			// ...formData,
			id: props.id,
			recurrenceRule, // Update the formData with the generated RRULE
		};

		updateSchedule({
			variables: updatedFormData,
		});
	};

	if (loading) return <p>Loading...</p>;


	return (
		<Dialog open={true} onClose={props.handleClose} fullWidth maxWidth="sm">
			<DialogTitle>Edit Schedule</DialogTitle>
			<form onSubmit={handleSubmit(onSubmit)}>
				<DialogContent dividers>


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


				</DialogContent>
				<DialogActions>
					<Button
						onClick={props.handleClose}
						sx={{ color: 'common.white' }}
					>
						Cancel
					</Button>
					<Button type="submit" color="primary" variant='contained'>
						Save
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
};

export default EditScheduleDialog;
