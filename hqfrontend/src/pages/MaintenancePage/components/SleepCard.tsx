import { Card, Typography } from "@mui/material";


interface SleepCardProps {

}

const SleepCard = (props: SleepCardProps) => {


    return (
        <Card sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="h5">Sleep</Typography>
            <Typography variant="body1">Sleep is important</Typography>
        </Card>
    )
}


export default SleepCard