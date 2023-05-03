import React, { useState } from 'react'
import { useQuery } from '@apollo/client'
import { GET_RITUALS } from '../../models/ritual'
import { Box, Dialog, Grid } from '@mui/material'

const RitualPage = () => {
	const [open, setOpen] = useState(false)

	const { loading, error, data } = useQuery(GET_RITUALS)



	const handleClickOpen = () => {
		setOpen(true)
	}

	const handleClose = () => {
		setOpen(false)
	}


	if (loading) return <div>Loading...</div>
	if (error) return <div>Error! {error.message}</div>

	const rituals = data.rituals.data


	return (
		<Box>
			<Grid container spacing={2}>

				<Grid item xs={8}>
					<h1>Ritual Page</h1>
				</Grid>

				<Grid item xs={4}>
					<button onClick={handleClickOpen}>Add Ritual</button>
				</Grid>


				<Grid item xs={12}>
					<ul>
						{rituals.map((ritual: any) => (
							<li key={ritual.id}>{ritual.attributes.Title}</li>
						))}
					</ul>
				</Grid>

			</Grid>

			<Dialog
				open={open}
				onClose={handleClose}
				aria-labelledby="form-dialog-title"
			>
			</Dialog>
		</Box>
	)
}

export default RitualPage