import React from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'
import { useMutation } from '@apollo/client'

// Qureries and mutations
import { UPDATE_RITUAL } from '../models/ritual'
import { GET_RITUAL } from '../models/ritual'



interface EditRitualDialogProps {
	id: string;
	title: string;
	handleClose: () => void;
}


const EditRitualDialog = ({ id, title, handleClose }: EditRitualDialogProps) => {
	const [newTitle, setNewTitle] = React.useState<string>(title);



	const [updateRitual] = useMutation(UPDATE_RITUAL, {
		onCompleted: (data) => {
			handleClose();
		},
		onError: (error) => {
			console.log(error)
		}
	});

	const handleSubmit = async () => {
		await updateRitual({
			variables: {
				id: id,
				title: newTitle,
			},
			refetchQueries: [{ query: GET_RITUAL, variables: { id: id } }]
		});
	};




	return (
		<Dialog open={true} onClose={() => handleClose()}>

			{/* Dialog Title */}
			<DialogTitle>
				Edit Ritual
			</DialogTitle>

			{/* Dialog Content */}
			<DialogContent>
				{/* Ritual Title */}
				<TextField
					autoFocus
					margin="dense"
					id="name"
					label="Ritual Title"
					type="text"
					fullWidth
					value={newTitle}
					onChange={(e) => setNewTitle(e.target.value)}
				/>
			</DialogContent>

			{/* Dialog Actions */}
			<DialogActions>
				<Button onClick={() => handleClose()} color="primary">
					Cancel
				</Button>
				<Button onClick={() => handleSubmit()} color="primary">
					Save
				</Button>
			</DialogActions>

		</Dialog>
	)
}

export default EditRitualDialog