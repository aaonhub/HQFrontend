import { Card, Typography } from "@mui/material";


interface SocialHealthCardProps {

}

const SocialHealthCard = (props: SocialHealthCardProps) => {


    return (
        <Card sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="h5">Social Health</Typography>
            <Typography variant="body1">Social Health is important</Typography>
        </Card>
    )
}


export default SocialHealthCard