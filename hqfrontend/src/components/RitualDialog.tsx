import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import { useQuery } from '@apollo/client';

// Queries and mutations
import { GET_RITUAL } from '../models/ritual';


interface RitualDialogProps {
    open: boolean;
    onClose: () => void;
    ritualId: string;
}

const RitualDialog: React.FC<RitualDialogProps> = ({ open, onClose, ritualId }) => {
    const [ritualTitle, setRitualTitle] = useState('');
    const [ritualItems, setRitualItems] = useState([]);

    const { loading, error, data } = useQuery(GET_RITUAL, {
        variables: { ritualId },
        skip: !ritualId, // Skip the query if ritualId is not provided
    });

    useEffect(() => {
        if (data && data.ritual) {
            setRitualTitle(data.ritual.title);
            setRitualItems(data.ritual.items);
        }
    }, [data]);

    const [checkedItems, setCheckedItems] = useState({});

    const handleCheckItem = (itemId: any) => {
        setCheckedItems((prevCheckedItems) => ({
            ...prevCheckedItems,
            // [itemId]: !prevCheckedItems[itemId],
        }));
    };

    const handleStop = () => {
        // Placeholder for the stop button functionality
        console.log('Stop button clicked');
    };

    const handleSave = () => {
        // Placeholder for the save button functionality
        console.log('Save button clicked');
        console.log(checkedItems);
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{ritualTitle}</DialogTitle>
            <DialogContent>
                {/* {ritualItems.map((item) => (
                    // <FormControlLabel
                        // key={item.id}
                        // control={
                        //     <Checkbox
                                // checked={checkedItems[item.id] || false}
                                // onChange={() => handleCheckItem(item.id)}
                        //     />
                        // }
                        // label={item.title}
                    // />
                ))} */}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleStop} color="primary">
                    Stop
                </Button>
                <Button onClick={handleSave} color="primary" variant="contained">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default RitualDialog;
