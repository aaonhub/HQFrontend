import { Card, Typography } from "@mui/material";


interface ShelterCardProps {

}

const ShelterCard = (props: ShelterCardProps) => {


    return (
        <Card sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="h5">Shelter</Typography>
            <Typography variant="body1">Shelter is important</Typography>
        </Card>
    )
}


export default ShelterCard