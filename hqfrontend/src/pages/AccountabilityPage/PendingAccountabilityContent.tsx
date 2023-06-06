import { Container, Typography, Box, Card, Grid, CardContent, List, ListItem, ListItemText, Button } from "@mui/material"

import { GET_ACCOUNTABILITY } from "../../models/accountability";
import { useQuery, useMutation } from "@apollo/client";

import { useGlobalContext } from "../App/GlobalContextProvider";

import { ACCEPT_ACCOUNTABILITY_INVITE } from "../../models/accountability"


const PendingAccountabilityContent = ({ id }: { id: string }) => {
    const { globalProfile } = useGlobalContext()
    const currentCodename = globalProfile.codename

    const { data, loading, error } = useQuery(GET_ACCOUNTABILITY, {
        variables: {
            id,
        },
    })

    const [acceptAccountabilityInvite] = useMutation(ACCEPT_ACCOUNTABILITY_INVITE, {
        variables: {
            id: id,
        },
        onCompleted: () => {
            window.location.reload()
        }
    })

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error :(</p>

    const accountability = data?.getAccountability

    return (
        <Container maxWidth="md">
            <Box my={4}>
                <Card>
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant="h4" align="center" gutterBottom>{accountability?.name}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="body1" gutterBottom>{accountability?.description}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="h6" gutterBottom>Organizer: {accountability?.organizer.codename}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="body1" gutterBottom>Start Date: {accountability?.startDate}</Typography>
                                <Typography variant="body1" gutterBottom>End Date: {accountability?.endDate ? accountability?.endDate : "Indefinite"}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="body1" gutterBottom>Type: {accountability?.type}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" gutterBottom>Participants:</Typography>
                                <List>
                                    {accountability?.participants.map((participant: any, index: number) => (
                                        <ListItem key={index}>
                                            <ListItemText primary={participant.codename} />
                                        </ListItem>
                                    ))}
                                </List>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" gutterBottom>Pending Participants:</Typography>
                                <List>
                                    {accountability?.pendingParticipants.map((participant: any, index: number) => (
                                        <ListItem key={index}>
                                            <ListItemText primary={participant.codename} />
                                            {/* Add an "Accept Invite" button if the user is the current user */}
                                            {participant.codename === currentCodename && (
                                                <Button onClick={() => acceptAccountabilityInvite()} color="primary" variant="contained">
                                                    Accept Invite
                                                </Button>
                                            )}
                                        </ListItem>
                                    ))}
                                </List>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Box>
        </Container>
    )
}

export default PendingAccountabilityContent
