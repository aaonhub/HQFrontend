import { Button, Card, CardActions, Typography } from "@mui/material";
import { useState } from "react";
import HygieneCardDialog from "./HygieneCardDialog";


const HygieneCard = () => {
    const [open, setOpen] = useState(false);


    return (
        <Card sx={{ p: 2, borderRadius: 2, border: '1px solid green' }}>
            <Typography variant="h5">Hygiene</Typography>
            <Typography variant="body1">Hygiene is important</Typography>

            <HygieneCardDialog open={open} handleClose={() => setOpen(false)} />

            <CardActions>
                <Button onClick={() => setOpen(true)}>Open</Button>
            </CardActions>
        </Card>
    )
}


export default HygieneCard