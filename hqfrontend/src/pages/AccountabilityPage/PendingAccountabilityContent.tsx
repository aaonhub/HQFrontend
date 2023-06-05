import { useState } from "react"
import { Container, Typography, Box, Card, Grid, CardContent, List, ListItem, ListItemText } from "@mui/material"

import { GET_ACCOUNTABILITY } from "../../models/accountability";
import { useQuery } from "@apollo/client";

const PendingAccountabilityContent = ({ id }: { id: string }) => {
    const { data, loading, error } = useQuery(GET_ACCOUNTABILITY, {
        variables: {
            id,
        },
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