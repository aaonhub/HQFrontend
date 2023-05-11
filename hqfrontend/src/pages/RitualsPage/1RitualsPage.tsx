import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { GET_RITUALS } from '../../models/ritual'
import { Box, Grid } from '@mui/material'
import NewRitualDialog from './NewRitualDialog'

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

	const rituals = data.rituals


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
							<li key={ritual.id}>{ritual.title}</li>
						))}
					</ul>
				</Grid>

			</Grid>

			<NewRitualDialog open={open} onClose={handleClose} />

		</Box>
	)
}

export default RitualPage