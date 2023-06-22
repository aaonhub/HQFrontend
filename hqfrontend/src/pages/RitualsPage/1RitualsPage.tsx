import { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { GET_RITUALS } from '../../models/ritual'
import { Box, Grid, Typography, Button, List, ListItem, ListItemText } from '@mui/material'
import NewRitualDialog from './NewRitualDialog'
import RitualDialog from '../../components/RitualDialog'

const RitualPage = () => {
	// Tab Title
	useEffect(() => {
		document.title = "Rituals - HQ";
	}, []);
	
	const [open, setOpen] = useState(false)
	const [openRitualDialog, setOpenRitualDialog] = useState(false)
	const [selectedRitual, setSelectedRitual] = useState('')

	const { loading, error, data, refetch } = useQuery(GET_RITUALS)

	if (loading) return <div>Loading...</div>
	if (error) return <div>Error! {error.message}</div>

	const rituals = data.rituals

	return (
		<Box>
			<Grid container spacing={2}>

				<Grid item xs={8}>
					<Typography variant="h1">Ritual Page</Typography>
				</Grid>

				<Grid item xs={4}>
					<Button variant="contained" onClick={() => setOpen(true)}>New Ritual</Button>
				</Grid>

				<Grid item xs={12}>
					<List>
						{rituals.map((ritual: any) => (
							<ListItem key={ritual.id} button onClick={() => {
								setSelectedRitual(ritual.id)
								setOpenRitualDialog(true)
							}}>
								<ListItemText primary={ritual.title} />
							</ListItem>
						))}
					</List>
				</Grid>

			</Grid>

			{/* Dialog */}
			{open && <NewRitualDialog open={open} onClose={() => { setOpen(false); refetch() }} />}
			{openRitualDialog && <RitualDialog open={openRitualDialog} onClose={() => { setOpenRitualDialog(false); refetch() }} ritualId={selectedRitual} />}
		</Box>
	)
}

export default RitualPage
