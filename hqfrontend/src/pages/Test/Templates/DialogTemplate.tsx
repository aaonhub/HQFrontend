import React from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'


interface TemplateDialogProps {
    id: string;
    handleClose: () => void;
}


const TemplateDialog = ({ id, handleClose }: TemplateDialogProps) => {


    return (
        <Dialog open={true} onClose={() => handleClose()}>

            {/* Dialog Title */}
            <DialogTitle>
                Hello
            </DialogTitle>

            {/* Dialog Content */}
            <DialogContent>
                Hello
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

export default TemplateDialog