import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { GET_RITUALS } from '../../models/ritual'
import { Box, Grid } from '@mui/material'
import NewRitualDialog from './NewRitualDialog'
import RitualDialog from '../../components/RitualDialog'

const RitualPage = () => {
	const [open, setOpen] = useState(false)
	const [openRitualDialog, setOpenRitualDialog] = useState(false)
	const [selectedRitual, setSelectedRitual] = useState('')

	const { loading, error, data } = useQuery(GET_RITUALS)




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
					<button onClick={() => setOpen(true)}>New Ritual</button>
				</Grid>


				<Grid item xs={12}>
					<ul>
						{rituals.map((ritual: any) => (
							// set selected ritual
							<li key={ritual.id} onClick={() => {
								setSelectedRitual(ritual.id)
								setOpenRitualDialog(true)
							}}>
								{ritual.title}
							</li>
						))}
					</ul>
				</Grid>

			</Grid>



			{/* Dialog */}
			{open &&
				<NewRitualDialog open={open} onClose={() => setOpen(false)} />
			}

			{
				openRitualDialog &&
				<RitualDialog open={openRitualDialog} onClose={() => setOpenRitualDialog(false)} ritualId={selectedRitual} />
			}


		</Box>
	)
}

export default RitualPage