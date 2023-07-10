import React, { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import { useMutation, useQuery } from '@apollo/client'
import CustomList from './CustomChecklist'
import useSound from 'use-sound'
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';


// Sounds
import complete from '../sounds/complete.wav'
import confirmation from '../sounds/confirmation.mp3'

// Queries and mutations
import { GET_RITUAL } from '../models/ritual'
import { START_RITUAL, COMPLETE_RITUAL, UPDATE_RITUAL, DELETE_RITUAL } from '../models/ritual'




interface RitualItem {
    id: string
    title: string
    checked: boolean
}

interface RitualDialogProps {
    open: boolean
    onClose: () => void
    ritualId: string
}

const RitualDialog: React.FC<RitualDialogProps> = ({ open, onClose, ritualId }) => {
    const [ritualTitle, setRitualTitle] = useState('')
    const [ritualItems, setRitualItems] = useState<RitualItem[]>([])




    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
    };




    // Sounds
    const [playConfirm] = useSound(confirmation, { volume: 0.1 });
    const [playComplete] = useSound(complete, { volume: 0.1 });




    const [startRitual] = useMutation(START_RITUAL)
    const [updateRitual] = useMutation(UPDATE_RITUAL)
    const [completeRitual] = useMutation(COMPLETE_RITUAL)
    const { loading, error } = useQuery(GET_RITUAL, {
        fetchPolicy: 'network-only',
        variables: { id: ritualId },
        onCompleted: (data) => {
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





    const handleCheckItem = (item: RitualItem) => {
        playConfirm();

        const updatedItems = ritualItems.map((ritualItem: any) => {
            if (ritualItem.id === item.id) {
                return {
                    ...ritualItem,
                    checked: !ritualItem.checked,
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
        const allItemsCompleted = updatedItems.every((ritualItem: RitualItem) => ritualItem.checked)
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
        playComplete()

        const updatedItems = ritualItems.map((ritualItem: RitualItem) => ({
            ...ritualItem,
            completed: false,
        }))

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
                })
            },
        })
    }

    const [deleteRitual] = useMutation(DELETE_RITUAL);
    const handleDelete = () => {
        deleteRitual({
            variables: {
                ritualId: ritualId,
            },
            onCompleted: () => {
                onClose();
            },
        });
    };



    // loading and error
    if (loading) return <p>Loading...</p>
    if (error) return <p>Error :(</p>


    return (
        <Dialog open={open} onClose={onClose}>

            {/* Ritual Title */}
            <DialogTitle>
                {ritualTitle}
                <IconButton
                    aria-label="menu"
                    aria-controls="menu"
                    aria-haspopup="true"
                    onClick={handleMenuOpen}
                    edge="end"
                >
                    <MoreVertIcon />
                </IconButton>
                <Menu
                    id="menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                >
                    <MenuItem>Edit</MenuItem>
                    <MenuItem
                        onClick={() => {
                            handleMenuClose();
                            handleDelete();
                        }}
                    >
                        Delete
                    </MenuItem>
                </Menu>
            </DialogTitle>



            {/*  Ritual List */}
            <DialogContent>
                {loading ? <p>Loading...</p> :
                    <CustomList
                        list={ritualItems}
                        handleCheckItem={handleCheckItem}
                        checklistType="strikeout"
                    />
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
