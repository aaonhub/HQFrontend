import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

interface HygieneCardDialogProps {
    open: boolean;
    handleClose: () => void;
}

const HygieneCardDialog = ({ open, handleClose }: HygieneCardDialogProps) => {
    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Hygiene</DialogTitle>

            <DialogContent>Hello</DialogContent>

            <DialogActions>
                <Button onClick={handleClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default HygieneCardDialog;
