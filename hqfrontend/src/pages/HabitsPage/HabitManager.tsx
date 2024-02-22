import React from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { GET_ALL_HABITS } from '../../models/habit';
import { useQuery } from '@apollo/client';


interface HabitManagerDialogProps {
    handleClose: () => void;
}


const HabitManagerDialog = ({ handleClose }: HabitManagerDialogProps) => {
    

    const { data, loading, error, refetch } = useQuery(GET_ALL_HABITS, {
        fetchPolicy: "network-only",
        onCompleted: (data: any) => {
            console.log(data)
        }
    })



    return (
        <Dialog open={true} onClose={() => handleClose()}>

            {/* Dialog Title */}
            <DialogTitle>
                Habit Manager
            </DialogTitle>

            {/* Dialog Content */}
            <DialogContent>
                {
                    loading ?
                        <div>Loading...</div>
                        :
                        <div>
                            {data.myHabits.map((habit: any) => (
                                <div key={habit.id}>
                                    {habit.title}
                                </div>
                            ))}
                        </div>
                }
            </DialogContent>

            {/* Dialog Actions */}
            <DialogActions>
                <Button onClick={() => handleClose()} color="primary">
                    Cancel
                </Button>
            </DialogActions>

            

        </Dialog>
    )
}

export default HabitManagerDialog