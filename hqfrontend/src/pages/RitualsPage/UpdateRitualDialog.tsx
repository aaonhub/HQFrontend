import React from 'react'
import { Dialog } from '@mui/material'

// Queries
// import { }


interface UpdateRitualDialogProps {
    id: string;
    handleClose: () => void;
}


const UpdateRitualDialog = ({ id, handleClose }: UpdateRitualDialogProps) => {
    return (
        <Dialog
            open={true}
            onClose={() => handleClose()}
        >
            <div>
                Hello
            </div>
        </Dialog>
    )
}

export default UpdateRitualDialog