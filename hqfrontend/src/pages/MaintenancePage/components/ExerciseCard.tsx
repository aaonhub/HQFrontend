import { Button, Card, CardActions, Typography } from "@mui/material";
import ExerciseCardDialog from "./ExerciseCardDialog";
import { useState } from "react";


const ExerciseCard = () => {
    const [open, setOpen] = useState(false);


    return (
        <Card sx={{ p: 2, borderRadius: 2, border: '1px solid green' }}>
            <Typography variant="h5">Exercise</Typography>
            <Typography variant="body1">Exercise is important</Typography>

            <ExerciseCardDialog open={open} handleClose={() => setOpen(false)} />

            <CardActions>
                <Button onClick={() => setOpen(true)}>Open</Button>
            </CardActions>
        </Card>
    )
}


export default ExerciseCard