import { useState } from "react";
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
	Button,
	Box,
	Grid,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Typography,
} from "@mui/material";
import { useMutation, useQuery } from "@apollo/client";

// Components
import CustomChecklist from "../../components/CustomChecklist";

// Queries and Mutations
import { AccountabilityType, GET_FRIENDS, CREATE_ACCOUNTABILITY } from "../../models/accountability";

// Globals
import { useGlobalContext } from '../App/GlobalContextProvider';



type AccountabilityLength = 'INDEFINITE' | 'ONE_WEEK' | 'ONE_MONTH' | 'ONE_YEAR';

const NewAccountabilityDialog = ({ open, handleClose }: any) => {
	const { globalProfile, setSnackbar } = useGlobalContext();

	const [name, setName] = useState<string>('');
	const [compType, setCompType] = useState<AccountabilityType>('Basic');
	const [startDate, setStartDate] = useState<string>('');
	const [length, setLength] = useState<AccountabilityLength>('INDEFINITE');
	const [description, setDescription] = useState<string>('');
	const [friends, setFriends] = useState<any>([]);


	// Friends Query
	const { loading, error, data } = useQuery(GET_FRIENDS, {
		onCompleted: (data) => {
			const friendList = data.friendList.map((friend: any) => {
				return {
					id: friend.id,
					title: friend.codename,
					checked: false
				}
			});
			setFriends(friendList);
		}
	});


	// Add Friend to Squad
	const handleAddToSquad = (squadMember: any) => {
		const updatedSquadMembers = friends.map((friend: any) => {
			if (globalProfile.codename === friend.title) {
				return {
					...friend,
					checked: true,
				}
			} else if (friend.id === squadMember.id) {
				return {
					...friend,
					checked: !friend.checked,
				}
			}
			return friend;
		})
		setFriends(updatedSquadMembers);
	}

	// Create Accountability Squad
	const [createAccountability] = useMutation(CREATE_ACCOUNTABILITY, {
		onCompleted: () => {
			setSnackbar({
				open: true,
				message: 'Accountability Squad Created!',
				severity: 'success'
			});
			handleClose();
		},
		onError: (error) => {
			console.log(error);
			setSnackbar({
				open: true,
				message: error.message,
				severity: 'error'
			});
		}
	});
	const handleCreateSquad = () => {
		// Ensure that there is at least one other friend selected
		const selectedFriends = friends.filter((friend: any) => friend.checked);
		if (selectedFriends.length < 1) {
			alert('Please select at least one friend');
			return;
		}

		// Ensure that a start date is selected
		if (!startDate || startDate === '') {
			alert('Please select a start date');
			return;
		}

		// Proceed with squad creation as before
		const squadMembers = selectedFriends.map((friend: any) => friend.id);
		const startDateObj = new Date(startDate);

		console.log(squadMembers)

		let endDateObj;
		switch (length) {
			case 'ONE_WEEK':
				endDateObj = new Date(startDateObj.getTime() + 7 * 24 * 60 * 60 * 1000);
				break;
			case 'ONE_MONTH':
				endDateObj = new Date(startDateObj.getTime() + 30 * 24 * 60 * 60 * 1000);
				break;
			case 'ONE_YEAR':
				endDateObj = new Date(startDateObj.getTime() + 365 * 24 * 60 * 60 * 1000);
				break;
			default:
				endDateObj = null;
		}

		createAccountability({
			variables: {
				name: name,
				accountabilityType: compType,
				startDate: startDate,
				endDate: endDateObj ? endDateObj.toISOString().split('T')[0] : null,
				description: description,
				type: "Basic",
				pendingParticipants: squadMembers
			}
		})
	}




	return (
		<Dialog open={open} onClose={handleClose} maxWidth='md' fullWidth>

			<DialogTitle>Create Accountability Squad</DialogTitle>

			<DialogContent>
				<Box
					component="form"
					noValidate
					autoComplete="off"
					onSubmit={e => {
						e.preventDefault();
						handleClose();
					}}
					sx={{ padding: 2 }}
				>
					<Grid container spacing={2}>

						<Grid item xs={4} sx={{ padding: 2 }}>

							{/* Add Agent Search Box */}
							{/* <TextField
								id="outlined-basic"
								label="Add Agent"
								variant="outlined"
								fullWidth
							/> */}

							{/* List of Friends */}
							<Box sx={{ maxHeight: 400, overflow: 'visible', marginTop: 2 }}>
								{loading && <p>Loading...</p>}
								{error && <p>Error :(</p>}

								{/* Organizer (aka self) */}
								<Typography variant='h6'>Organizer:</Typography>
								<CustomChecklist
									list={[{
										id: "0",
										title: globalProfile.codename,
										checked: true
									}]}
									handleCheckItem={handleAddToSquad}
									checklistType='highlight'
								/>

								{/* Friends */}
								<Typography variant='h6'>Squad Members:</Typography>
								{data && data.friendList &&
									< CustomChecklist
										list={friends}
										handleCheckItem={handleAddToSquad}
										checklistType='highlight'
									/>
								}
							</Box>


						</Grid>

						<Grid item xs={8} sx={{ padding: 2 }}>

							{/* Name */}
							<TextField
								id="outlined-multiline-static"
								label="Name"
								variant="outlined"
								sx={{ marginBottom: 2 }}
								fullWidth
								value={name}
								onChange={e => setName(e.target.value)}
							/>

							{/* Accountability Type Dropdown */}
							<FormControl fullWidth variant="outlined" sx={{ marginBottom: 2 }}>
								<InputLabel id="accountability-type-label">Accountability Type</InputLabel>
								<Select
									labelId="accountability-type-label"
									id="accountability-type-select"
									value={compType}
									onChange={e => setCompType(e.target.value as AccountabilityType)}
									label="Accountability Type"
								>
									<MenuItem value="Basic">Basic</MenuItem>
									{/* FINISHLATER */}
									{/* <MenuItem value="HABIT_TRACKING">Habit Tracking</MenuItem> */}
								</Select>
							</FormControl>

							{/* Start Date */}
							<TextField
								id="date"
								label="Start Date"
								type="date"
								variant="outlined"
								fullWidth
								value={startDate}
								onChange={e => setStartDate(e.target.value)}
								sx={{ marginBottom: 2 }}
								InputLabelProps={{ shrink: true }}
							/>

							{/* Length */}
							<FormControl fullWidth variant="outlined" sx={{ marginBottom: 2 }}>
								<InputLabel id="accountability-length-label">Accountability Length</InputLabel>
								<Select
									labelId="accountability-length-label"
									id="accountability-length-select"
									value={length}
									onChange={e => setLength(e.target.value as AccountabilityLength)}
									label="Accountability Length"
								>
									<MenuItem value="INDEFINITE">Indefinite</MenuItem>
									<MenuItem value="ONE_WEEK">One Week</MenuItem>
									<MenuItem value="ONE_MONTH">One Month</MenuItem>
									<MenuItem value="ONE_YEAR">One Year</MenuItem>
								</Select>
							</FormControl>

							{/* Description */}
							<TextField
								id="outlined-multiline-static"
								label="Description"
								multiline
								rows={4}
								variant="outlined"
								fullWidth
								value={description}
								onChange={e => setDescription(e.target.value)}
							/>
						</Grid>

					</Grid>
				</Box>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose} color="primary">Cancel</Button>
				<Button onClick={handleCreateSquad} color="primary" variant="contained">Save</Button>
			</DialogActions>
		</Dialog>
	);
}

export default NewAccountabilityDialog;
