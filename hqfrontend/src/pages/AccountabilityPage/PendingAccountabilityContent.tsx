import { useState } from "react"
import { Container, Typography } from "@mui/material"


import { GET_ACCOUNTABILITY } from "../../models/accountability";
import { useQuery } from "@apollo/client";



const PendingAccountabilityContent = ({ id }: { id: string }) => {

    const { data, loading, error } = useQuery(GET_ACCOUNTABILITY, {
        variables: {
            id: id
        },
        onError: (error) => {
            console.log(error.message)
        },
        onCompleted: (data) => {
            console.log(data)
        },
    })

    loading && <p>Loading...</p>
    error && <p>Error :(</p>


    return (
        <Container style={{ padding: "2rem" }}>

        {/* Title */}
        <Typography variant="h3" align="center" gutterBottom>{data?.getAccountability.name}</Typography>

        

        </Container>
    )
}

export default PendingAccountabilityContent