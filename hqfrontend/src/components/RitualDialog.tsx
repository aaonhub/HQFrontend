import React, { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import { useMutation, useQuery } from '@apollo/client'
import CustomList from './CustomList'

// Queries and mutations
import { GET_RITUAL } from '../models/ritual'
import { START_RITUAL, COMPLETE_RITUAL, UPDATE_RITUAL } from '../models/ritual'


interface RitualItem {
    id: string
    title: string
    completed: boolean
}


interface RitualDialogProps {
    open: boolean
    onClose: () => void
    ritualId: string
}

const RitualDialog: React.FC<RitualDialogProps> = ({ open, onClose, ritualId }) => {
    const [ritualTitle, setRitualTitle] = useState('')
    const [ritualItems, setRitualItems] = useState<RitualItem[]>([])

    const [startRitual] = useMutation(START_RITUAL)
    const [updateRitual] = useMutation(UPDATE_RITUAL, {
        onCompleted: (data) => {
            console.log(data)
        },
    })


    const { loading, error } = useQuery(GET_RITUAL, {
        fetchPolicy: 'network-only',
        variables: { id: ritualId },
        onCompleted: (data) => {
            console.log(data)
            if (data && data.ritual) {
                setRitualTitle(data.ritual.title)
                setRitualItems(JSON.parse(data.ritual.ritualItems))
            }
            if (!data.ritual.inProgress) {
                startRitual({
                    variables: {
                        ritualId: ritualId,
                    },
                })
            }
        },
        skip: !ritualId,
    })


    const [completeRitual] = useMutation(COMPLETE_RITUAL)



    const handleCheckItem = (item: RitualItem) => {

        const updatedItems = ritualItems.map((ritualItem: any) => {
            if (ritualItem.id === item.id) {
                return {
                    ...ritualItem,
                    completed: !ritualItem.completed,
                }
            }
            return ritualItem
        })

        updateRitual({
            variables: {
                id: ritualId,
                ritualItems: JSON.stringify(updatedItems),
            },
        })


        setRitualItems(updatedItems)

        // Check if all items are completed
        const allItemsCompleted = updatedItems.every((ritualItem: RitualItem) => ritualItem.completed)
        if (allItemsCompleted) {
            handleComplete()
        }
    }


    const handleStop = () => {
        const updatedItems = ritualItems.map((ritualItem: RitualItem) => ({
            ...ritualItem,
            completed: false,
        }));

        updateRitual({
            variables: {
                id: ritualId,
                ritualItems: JSON.stringify(updatedItems),
            },
            onCompleted: () => {
                completeRitual({
                    variables: {
                        ritualId: ritualId,
                        status: 'DROPPED',
                    },
                    onCompleted: () => {
                        onClose();
                    },
                });
            },
        });
    };

    const handleComplete = () => {
        const updatedItems = ritualItems.map((ritualItem: RitualItem) => ({
            ...ritualItem,
            completed: false,
        }));

        updateRitual({
            variables: {
                id: ritualId,
                ritualItems: JSON.stringify(updatedItems),
            },
            onCompleted: () => {
                completeRitual({
                    variables: {
                        ritualId: ritualId,
                        status: 'COMPLETED',
                    },
                    onCompleted: () => {
                        onClose();
                    },
                });
            },
        });
    };



    // loading and error
    if (loading) return <p>Loading...</p>
    if (error) return <p>Error :(</p>


    return (
        <Dialog open={open} onClose={onClose}>

            {/* Ritual Title */}
            <DialogTitle>{ritualTitle}</DialogTitle>


            {/*  Ritual List */}
            <DialogContent>
                {loading ? <p>Loading...</p> :
                    <CustomList list={ritualItems} handleCheckItem={handleCheckItem} />
                }
            </DialogContent>


            {/* Stop and Save Buttons */}
            <DialogActions>
                <Button onClick={handleStop} color="primary">
                    Stop
                </Button>
                <Button onClick={handleComplete} color="primary" variant="contained">
                    Complete
                </Button>
            </DialogActions>


        </Dialog>
    )
}

export default RitualDialog
