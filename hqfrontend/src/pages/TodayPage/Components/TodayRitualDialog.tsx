import React, { useEffect, useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import { useMutation, useQuery } from '@apollo/client'
import CustomList from '@/components/CustomChecklist'
import useSound from 'use-sound'
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

// Components
import { useGlobalContext } from '@/pages/App/GlobalContextProvider'
import EditRitualDialog from '@/components/EditRitualDialog'

// Sounds
import complete from '../../../sounds/complete.wav'
import confirmation from '../../../sounds/confirmation.mp3'

// Queries and mutations
import {
    DELETE_RITUAL,
    GET_RITUAL,
    UPDATE_RITUAL_HISTORY,
    RitualHistoryManager, RitualEntry, RitualStatus
} from '@/models/ritual'
import { CHECK_HABIT } from '@/models/habit'
import { currentLocalTime, getCurrentLocalDate } from '@/components/DateFunctions'


interface RitualItem {
    id: string
    title: string
    checked: boolean
}

interface TodayRitualDialogProps {
    onClose: () => void
    ritualId: string
    entryDate: string
    scheduleId: string
    ritualHistory: RitualHistoryManager
    setRitualHistory: (ritualHistory: RitualHistoryManager) => void
}


const TodayRitualDialog: React.FC<TodayRitualDialogProps> = (props: TodayRitualDialogProps) => {
    const { setDebugText } = useGlobalContext()!

    const [ritualTitle, setRitualTitle] = useState('')
    const [ritualItems, setRitualItems] = useState<RitualItem[]>([])
    const [checkedIds, setCheckedIds] = useState<string[]>([])
    const [editRitualDialogMenuOpen, setEditRitualDialogMenuOpen] = useState(false)
    const [entry, setEntry] = useState<RitualEntry>({
        ritualID: '',
        scheduleID: '',
        completedItems: [],
        startTime: null,
        completedTime: null,
        status: RitualStatus.Unstarted
    })
    const [ritualHistoryManager, setRitualHistoryManager] = useState<RitualHistoryManager>(new RitualHistoryManager())


    // Sounds
    const [playConfirm] = useSound(confirmation, { volume: 0.1 });
    const [playComplete] = useSound(complete, { volume: 0.1 });


    // Get ritual data
    const { loading, error, data } = useQuery(GET_RITUAL, {
        variables: { id: props.ritualId },
        onCompleted: (data) => {
            // Set title
            setRitualTitle(data.ritual.title)

            let entry1: RitualEntry | null = null

            // If entry exists, set it
            if (props.entryDate && props.ritualHistory && props.scheduleId) {
                entry1 = props.ritualHistory.getEntryById(props.entryDate, props.scheduleId)
                if (entry1) {
                    setEntry(entry1)
                    setCheckedIds(entry1.completedItems)
                }
            }
            // Otherwise create it
            else {
                const ritualEntry: RitualEntry = {
                    ritualID: props.ritualId,
                    scheduleID: props.scheduleId,
                    completedItems: [],
                    startTime: null,
                    completedTime: null,
                    status: RitualStatus.Unstarted
                };

                entry1 = ritualEntry

                ritualHistoryManager.addOrUpdateEntry(props.entryDate, ritualEntry);  // Changed this line to use updateEntry
                setEntry(ritualEntry)
            }

            // Set ritual items and checked state
            const updatedRitualItems = JSON.parse(data.ritual.ritualItems).map((ritualItem: any) => {
                const isChecked = entry1 ? entry1.completedItems.includes(ritualItem.id) : false;
                return {
                    ...ritualItem,
                    checked: entry1?.status === RitualStatus.Completed ? true : isChecked,
                };
            });
            setRitualItems(updatedRitualItems)

            // Set the checkedIds state based on the checked property of the updated ritual items
            setCheckedIds(updatedRitualItems.filter((item: { checked: any }) => item.checked).map((item: { id: any }) => item.id))
        },
    })


    // Update ritual history
    const [updateRitualHistory] = useMutation(UPDATE_RITUAL_HISTORY)
    const handleUpdateRitualHistory = () => {
        updateRitualHistory({
            variables: {
                yearMonth: props.entryDate.slice(0, 7),
                data: props.ritualHistory.toJson(),
            },
            onError: (error) => {
                console.log(error)
            }
        })
    }
    const handleCompleteRitualHistory = (options: any) => {
        updateRitualHistory({
            ...options,
            onCompleted: () => {
                props.onClose()
            },
            onError: (error) => {
                console.log(error);
            },
        });
    };



    // Complete ritual entry
    const handleCompleteRitual = () => {
        // Update Unscheduled Ritual

        props.ritualHistory.addOrUpdateEntry(props.entryDate, {
            ritualID: props.ritualId,
            scheduleID: props.scheduleId,
            startTime: entry.startTime,
            completedItems: [],
            completedTime: new Date(),
            status: RitualStatus.Completed,
        });


        handleCompleteRitualHistory({
            variables: {
                yearMonth: getCurrentLocalDate().slice(0, 7),
                data: props.ritualHistory.toJson(),
            },
        })
    }


    // Check habit
    const [checkHabit] = useMutation(CHECK_HABIT)
    const handleCheckHabit = (habitId: string, quantity: number) => {
        checkHabit({
            fetchPolicy: 'no-cache',
            variables: {
                habitId: habitId,
                currentDate: props.entryDate ? props.entryDate : getCurrentLocalDate(),
                quantity: quantity,
            },
            onError: (error) => {
                console.log(error)
            }
        })
    }



    // Check item
    const handleCheckItem = async (item: RitualItem) => {
        // Play sound
        playConfirm();

        // Update checked items
        let newCheckedIds = [];
        if (checkedIds.includes(item.id)) {
            newCheckedIds = checkedIds.filter((checkedId) => checkedId !== item.id);
        } else {
            newCheckedIds = [...checkedIds, item.id];
        }
        setCheckedIds(newCheckedIds);

        // Update ritual items
        const updatedItems = ritualItems.map((ritualItem) => {
            if (ritualItem.id === item.id) {

                // If habit update it
                if (item.id.startsWith('h')) {
                    ritualItem.checked ? handleCheckHabit(item.id.slice(1), -1) : handleCheckHabit(item.id.slice(1), 1)
                }

                return {
                    ...ritualItem,
                    checked: !ritualItem.checked,
                };
            }
            return ritualItem;
        });
        setRitualItems(updatedItems);

        const ritualEntry: RitualEntry = {
            ritualID: props.ritualId,
            scheduleID: entry.scheduleID,
            completedItems: newCheckedIds,
            startTime: entry.startTime ? entry.startTime : currentLocalTime(),
            completedTime: null,
            status: RitualStatus.InProgress,
        };

        props.ritualHistory.addOrUpdateEntry(props.entryDate, ritualEntry);
        setEntry(ritualEntry);

        // If ritual is completed, play sound and update ritual history
        if (updatedItems.every((ritualItem) => ritualItem.checked)) {
            playComplete();
            handleCompleteRitual();
        }

        // Update ritual history
        if (props.scheduleId) {
            handleUpdateRitualHistory()
        }
    };



    const [deleteRitual] = useMutation(DELETE_RITUAL);
    const handleDelete = () => {
        deleteRitual({
            variables: {
                ritualId: props.ritualId,
            },
            onCompleted: () => {
                props.onClose();
            },
        });
    };


    // Submenu
    const [submenu, setSubmenu] = useState<null | HTMLElement>(null);
    const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setSubmenu(event.currentTarget);
    };
    const handleMenuClose = () => {
        setSubmenu(null);
    };


    // Debug
    useEffect(() => {
        setDebugText([
            { title: 'Ritual Title', content: ritualTitle },
            { title: 'Ritual Items', content: JSON.stringify(ritualItems, null, 2) },
            { title: 'Data', content: JSON.stringify(data, null, 2) },
            { title: 'Entry Date', content: props.entryDate },
            { title: 'Schedule ID', content: props.scheduleId },
            { title: 'Entry', content: JSON.stringify(entry, null, 2) },
            { title: 'Ritual History', content: JSON.stringify(props.ritualHistory, null, 2) },
        ])
    }, [data, props.ritualId, setDebugText, ritualTitle, ritualItems, props.entryDate, props.scheduleId, entry, props.ritualHistory])



    // loading and error
    if (loading) return <p>Loading...</p>
    if (error) return <p>Error :(</p>


    return (
        <Dialog open={true} onClose={props.onClose} fullWidth maxWidth="sm">

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
                    anchorEl={submenu}
                    keepMounted
                    open={Boolean(submenu)}
                    onClose={handleMenuClose}
                >
                    <MenuItem
                        onClick={() => {
                            handleMenuClose();
                            setEditRitualDialogMenuOpen(true);
                        }}
                    >Edit</MenuItem>
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
                <Button onClick={handleCompleteRitual} color="primary" variant="contained">
                    Complete
                </Button>
            </DialogActions>

            {editRitualDialogMenuOpen && (
                <EditRitualDialog
                    id={props.ritualId}
                    title={ritualTitle}
                    handleClose={() => setEditRitualDialogMenuOpen(false)}
                />
            )}


        </Dialog>
    )
}

export default TodayRitualDialog
