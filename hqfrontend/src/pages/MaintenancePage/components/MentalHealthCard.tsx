import { Card, Typography } from "@mui/material";


interface MentalHealthCardProps {

}

const MentalHealthCard = (props: MentalHealthCardProps) => {


    return (
        <Card sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="h5">Mental Health</Typography>
            <Typography variant="body1">Social Health is important</Typography>
        </Card>
    )
}


export default MentalHealthCard