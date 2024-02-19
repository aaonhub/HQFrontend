import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { useMutation, useQuery } from '@apollo/client';
import { useForm, Controller } from "react-hook-form";

// Queries and mutations
import { GET_SCHEDULE, UPDATE_SCHEDULE } from '../models/schedule';

interface IFormInput {
    id: string;
    schedule: string;
    timeOfDay: string;
    recurrenceRule: string;
    exclusionDates: string;
    reminderBeforeEvent: string;
    description: string;
    objectId: string;
}

interface EditScheduleDialogProps {
    id: string;
    handleClose: () => void;
}

const EditScheduleDialog = ({ id, handleClose }: EditScheduleDialogProps) => {


    const { data, loading } = useQuery(GET_SCHEDULE, {
        variables: { id: id },
        fetchPolicy: "network-only",
    });

    const [updateSchedule] = useMutation(UPDATE_SCHEDULE, {
        onCompleted: () => handleClose(),
    });

    const { control, handleSubmit, setValue } = useForm<IFormInput>({
        defaultValues: {
            schedule: '',
            timeOfDay: '',
            recurrenceRule: '',
            exclusionDates: '',
            reminderBeforeEvent: '',
            description: '',
            objectId: '',
        }
    });


    React.useEffect(() => {
        if (!loading && data) {
            const scheduleData = data.getSchedule;
            setValue('schedule', scheduleData.schedule || 'No Schedule');
            setValue('timeOfDay', scheduleData.timeOfDay || '');
            setValue('recurrenceRule', scheduleData.recurrenceRule || '');
            setValue('exclusionDates', scheduleData.exclusionDates || '');
        }
    }, [data, loading, setValue]);


    const onSubmit = (formData: IFormInput) => {
        updateSchedule({
            variables: { ...formData }
        });
    };

    if (loading) return <p>Loading...</p>;
    

    return (
        <Dialog open={true} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>Edit Schedule</DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent dividers>
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

                    {/* Time of Day */}
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


                    {/* Recurrence Rule */}
                    <Controller
                        name="recurrenceRule"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Recurrence Rule"
                                margin="dense"
                                fullWidth
                                variant="outlined"
                            />
                        )}
                    />

                    {/* Exclusion Dates */}
                    <Controller
                        name="exclusionDates"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Exclusion Dates"
                                margin="dense"
                                fullWidth
                                variant="outlined"
                            />
                        )}
                    />

                    {/* Reminder Before Event */}
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

                    {/* Description */}
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


                    {/* Object ID - Assuming this is not meant to be edited but here for completeness */}
                    <Controller
                        name="objectId"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Object ID"
                                margin="dense"
                                fullWidth
                                variant="outlined"
                                disabled // Assuming it's not editable
                            />
                        )}
                    />

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button type="submit" color="primary">
                        Save
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default EditScheduleDialog;
