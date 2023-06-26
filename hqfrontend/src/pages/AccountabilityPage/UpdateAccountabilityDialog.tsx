import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useGlobalContext } from '../App/GlobalContextProvider';

// Queries and Mutations
import { GET_ACCOUNTABILITY } from '../../models/accountability';
import { UPDATE_ACCOUNTABILITY } from '../../models/accountability';



interface UpdateAccountabilityDialogProps {
    onClose: any;
    accountabilityId: string;
}

const UpdateAccountabilityDialog = ({ onClose, accountabilityId }: UpdateAccountabilityDialogProps) => {
    const { setSnackbar } = useGlobalContext();
    const [accountabilityType, setAccountabilityType] = useState<string>('');


    // Accountability Query
    useQuery(GET_ACCOUNTABILITY, {
        variables: { id: accountabilityId },
        onError: (error) => {
            console.log(error.message);
        },
        onCompleted: (data) => {
            setAccountabilityType(data.getAccountability.type);
        },
    });


    const [updateAccountability] = useMutation(UPDATE_ACCOUNTABILITY, {
        variables: {
            id: accountabilityId,
            type: accountabilityType,
        },
        onCompleted: () => {
            onClose();
            setSnackbar({
                message: "Accountability updated successfully",
                open: true,
                severity: "success",
            });
        },
    });
    const handleUpdateAccountability = () => {
        updateAccountability();
    };


    const handleAccountabilityTypeChange = (event: any) => {
        setAccountabilityType(event.target.value);
    };

    return (
        <Dialog open={true} onClose={onClose}>

            <DialogTitle>Update Accountability</DialogTitle>

            <DialogContent dividers>
                <FormControl fullWidth>
                    <InputLabel id="Type">Type</InputLabel>
                    <Select
                        labelId="Type-select-label"
                        id="Type-select"
                        value={accountabilityType}
                        label="Type"
                        onChange={(event) => handleAccountabilityTypeChange(event)}
                    >
                        <MenuItem value={"Basic"}>Basic</MenuItem>
                        <MenuItem value={"Basic Shared"}>Basic Shared</MenuItem>
                    </Select>
                </FormControl>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleUpdateAccountability}>Save</Button>
            </DialogActions>

        </Dialog>
    );
}

export default UpdateAccountabilityDialog;