import { useState } from "react"
import { Button, Container, Grid, TextField, Typography, Card, CardContent } from "@mui/material"
import NewAccountabilityDialog from "./NewAccountabilityDialog"

// Globals
import { useGlobalContext } from '../App/GlobalContextProvider';

import {
    GET_FRIEND_REQUESTS,
    SEND_FRIEND_REQUEST,
    ACCEPT_FRIEND_REQUEST,
    DECLINE_FRIEND_REQUEST,
    GET_FRIENDS,
} from "../../models/accountability"
import { useMutation, useQuery } from "@apollo/client"


const FriendsContent = () => {
    const { setSnackbar } = useGlobalContext()

    const [dialogOpen, setDialogOpen] = useState(false)
    const [contactRequestName, setContactRequestName] = useState<string>("")


    // Send Friend Requests
    const [sendFriendRequest] = useMutation(SEND_FRIEND_REQUEST, {
        onError: (error) => {
            console.log(error.message)
            if (error.message.includes("You're going to make me cry.")) {
                setSnackbar({
                    message: error.message,
                    open: true,
                    severity: "info"
                })
            } else {
                setSnackbar({
                    message: error.message,
                    open: true,
                    severity: "warning"
                })
            }
        },
        onCompleted: (data) => {
            console.log(data.sendFriendRequest.message)
            setSnackbar({
                message: data.sendFriendRequest.message,
                open: true,
                severity: "success"
            })
            setContactRequestName("")
        },
    })
    const handleSendFriendRequest = () => {
        sendFriendRequest({
            variables: {
                codename: contactRequestName
            }
        })
    }


    // Get Friend Requests
    const { data } = useQuery(GET_FRIEND_REQUESTS, {
        fetchPolicy: "network-only",
        onError: (error) => {
            console.log(error.message)
        },
        onCompleted: (data) => {
            console.log(data.friendRequests)
        }
    })


    // Get Friends
    const { data: friendsData } = useQuery(GET_FRIENDS, {
        fetchPolicy: "network-only",
        onError: (error) => {
            console.log(error.message)
        },
        onCompleted: (data) => {
            console.log(data.friendList)
        }
    })



    // Accept Friend Request
    const [acceptFriendRequest] = useMutation(ACCEPT_FRIEND_REQUEST, {
        onError: (error) => {
            setSnackbar({
                message: error.message,
                open: true,
                severity: "warning"
            })
        },
        onCompleted: (data) => {
            setSnackbar({
                message: data.acceptFriendRequest.message,
                open: true,
                severity: "success"
            })
        }
    })
    const handleAcceptFriendRequest = (codename: string) => {
        acceptFriendRequest({
            variables: {
                codename: codename
            }
        })
    }


    // Decline Friend Request
    const [declineFriendRequest] = useMutation(DECLINE_FRIEND_REQUEST, {
        onError: (error) => {
            setSnackbar({
                message: error.message,
                open: true,
                severity: "warning"
            })
        },
        onCompleted: (data) => {
            setSnackbar({
                message: data.declineFriendRequest.message,
                open: true,
                severity: "info"
            })
        }
    })
    const handleDeclineFriendRequest = (codename: string) => {
        declineFriendRequest({
            variables: {
                codename: codename
            }
        })
    }








    const handleClose = () => {
        setDialogOpen(false)
    }



    return (
        <Container style={{ padding: "2rem" }}>
            <Grid container spacing={3}>

                {/* Left Side */}
                <Grid item xs={12}>
                    <Card style={{ height: "100%" }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Friends:</Typography>
                            <TextField
                                id="outlined-basic"
                                label="Add Friend"
                                variant="outlined"
                                fullWidth
                                value={contactRequestName}
                                type="search"
                                autoComplete="off"
                                onChange={(e) => setContactRequestName(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleSendFriendRequest()
                                    }
                                }}
                            />
                        </CardContent>


                        {/* Friends List */}
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Friends List:</Typography>
                            {friendsData?.friendList?.map((friend: any) => {
                                return (
                                    <div key={friend.id}>
                                        <Typography>{friend.codename}</Typography>
                                    </div>
                                )
                            })}
                        </CardContent>


                        <CardContent>
                            <Typography variant="h6" gutterBottom>Incoming Friend Requests:</Typography>
                            {data?.incomingFriendRequests?.map((friendRequest: any) => {
                                return (
                                    <div key={friendRequest}>
                                        <Typography>{friendRequest.codename}</Typography>
                                        <Button variant="contained" color="success" onClick={() => handleAcceptFriendRequest(friendRequest.codename)}>
                                            Accept
                                        </Button>
                                        <Button variant="contained" color="error" onClick={() => handleDeclineFriendRequest(friendRequest.codename)}>
                                            Decline
                                        </Button>
                                    </div>
                                )
                            })}
                        </CardContent>

                    </Card>
                </Grid>



            </Grid>

            {<NewAccountabilityDialog open={dialogOpen} handleClose={handleClose} />}


        </Container>
    )
}

export default FriendsContent
