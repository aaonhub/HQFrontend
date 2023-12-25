import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

interface ExerciseCardDialogProps {
    open: boolean;
    handleClose: () => void;
}

const ExerciseCardDialog = ({ open, handleClose }: ExerciseCardDialogProps) => {
    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Exercise</DialogTitle>

            <DialogContent>Hello</DialogContent>

            <DialogActions>
                <Button onClick={handleClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ExerciseCardDialog;
