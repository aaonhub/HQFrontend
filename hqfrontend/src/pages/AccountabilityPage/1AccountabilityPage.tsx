import { useEffect, useState } from "react"
import { Button, Container, Grid, Typography, Card, CardContent, List, ListItem, ListItemText, Paper, ListItemButton, ListItemIcon } from "@mui/material"
import NewAccountabilityDialog from "./NewAccountabilityDialog"

import FriendsContent from "./FriendsContent";
import AccountabilityDisplay from "./AccountabilityDisplay";
import PendingAccountabilityContent from "./PendingAccountabilityContent";
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import lightBlue from '@mui/material/colors/lightBlue';
import lightGreen from '@mui/material/colors/lightGreen';


import { GET_ACCOUNTABILITIES } from "../../models/accountability";
import { useQuery } from "@apollo/client";

const AccountabilityPage = () => {
	// Tab Title
	useEffect(() => {
		document.title = "Accountability - HQ";
	}, []);
    
    const [dialogOpen, setDialogOpen] = useState(false)
    const [selectedContent, setSelectedContent] = useState("friends")
    const [selectedAccountability, setSelectedAccountability] = useState("")

    const { data, loading, error } = useQuery(GET_ACCOUNTABILITIES, {
        onError: (error) => {
            console.log(error.message)
        },
        onCompleted: (data) => {
            console.log(data)
        },
    })

    const handleClose = () => {
        setDialogOpen(false)
    }

    return (
        <Container style={{ padding: "2rem" }}>
            <Typography variant="h3" align="center" gutterBottom>Accountability Page</Typography>
            <Grid container spacing={3}>

                {/* Left Side */}
                <Grid item xs={4}>
                    <Card style={{ height: "100%" }}>
                        <List>

                            {/* Friends Button */}
                            <ListItem button onClick={() => setSelectedContent("friends")}>
                                <ListItemText primary="Friends" />
                            </ListItem>

                            {/* Divider */}
                            <ListItem>
                                <ListItemText primary="" />
                            </ListItem>

                            {/* Label of new subsection */}
                            <ListItem>
                                <Typography variant="h5" align="center" gutterBottom>Accountability Squads:</Typography>
                            </ListItem>


                            {/* Squads */}
                            <List>
                                {data?.myAccountabilities.map((accountability: any) => (
                                    <ListItem key={accountability.id} >
                                        <Paper
                                            elevation={1}
                                            onClick={() => {
                                                accountability.status === 'PE' ? setSelectedContent('pending') : setSelectedContent('active')
                                                setSelectedAccountability(accountability.id)
                                            }}
                                            sx={{
                                                width: "100%",
                                                mb: 1
                                            }}
                                        >
                                            <ListItemButton>
                                                {accountability.status === 'PE' && <ListItemIcon><FiberManualRecordIcon sx={{ color: lightBlue[500] }} /></ListItemIcon>}
                                                {accountability.status === 'AC' && <ListItemIcon><FiberManualRecordIcon sx={{ color: lightGreen[600] }} /></ListItemIcon>}
                                                <ListItemText primary={accountability.name} secondary={accountability.status === 'PE' ? 'Pending' : ''} />
                                            </ListItemButton>
                                        </Paper>
                                    </ListItem>
                                ))}
                            </List>

                        </List>

                        {/* Create Accountability Squad Button */}
                        <CardContent>
                            <Button variant="contained" fullWidth color="primary" onClick={() => setDialogOpen(true)}>
                                Create Accountability Squad
                            </Button>
                        </CardContent>

                    </Card>
                </Grid>

                {/* Right Side */}
                <Grid item xs={8}>
                    <Card style={{ height: "100%" }}>
                        {selectedContent === 'friends' && <FriendsContent />}
                        {selectedContent === 'active' && <AccountabilityDisplay id={selectedAccountability} />}
                        {selectedContent === 'pending' && <PendingAccountabilityContent id={selectedAccountability} />}
                    </Card>
                </Grid>

            </Grid>

            {/* Dialog */}
            <NewAccountabilityDialog open={dialogOpen} handleClose={handleClose} />
        </Container>
    )
}

export default AccountabilityPage
