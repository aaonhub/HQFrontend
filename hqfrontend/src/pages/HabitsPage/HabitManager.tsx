import React, { useState } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    List,
    ListItem,
    ListItemText,
} from '@mui/material';
import { GET_ALL_HABITS } from '../../models/habit';
import { useQuery } from '@apollo/client';
import EditHabitDialog from '@/components/EditHabitDialog';

interface HabitManagerDialogProps {
    handleClose: () => void;
}

const HabitManagerDialog = ({ handleClose }: HabitManagerDialogProps) => {
    const [openEditHabitDialog, setOpenEditHabitDialog] = useState(false);
    const [habitId, setHabitId] = useState('');

    const { data, loading, error, refetch } = useQuery(GET_ALL_HABITS, {
        fetchPolicy: 'network-only',
        onCompleted: (data: any) => {
            // console.log(data);
        },
        onError: (error) => {
            console.log(error);
        }
    });

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error</div>;

    const handleHabitClick = (id: string) => {
        setHabitId(id);
        setOpenEditHabitDialog(true);
    };

    return (
        <>
            <Dialog open={true} onClose={() => handleClose()}>
                {/* Dialog Title */}
                <DialogTitle>Habit Manager</DialogTitle>
                {/* Dialog Content */}
                <DialogContent>
                    <List>
                        {data.myHabits.map((habit: any) => (
                            <ListItem
                                key={habit.id}
                                button
                                onClick={() => handleHabitClick(habit.id)}
                            >
                                <ListItemText primary={habit.title} />
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
                {/* Dialog Actions */}
                <DialogActions>
                    <Button onClick={() => handleClose()} color="primary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
            {openEditHabitDialog && (
                <EditHabitDialog
                    onClose={() => setOpenEditHabitDialog(false)}
                    habitId={habitId}
                />
            )}
        </>
    );
};

export default HabitManagerDialog;