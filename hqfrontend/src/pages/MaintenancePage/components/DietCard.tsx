import { Card, Typography } from "@mui/material";


interface DietCardProps {

}

const DietCard = (props: DietCardProps) => {


    return (
        <Card sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="h5">Diet</Typography>
            <Typography variant="body1">Diet is important</Typography>
        </Card>
    )
}


export default DietCard