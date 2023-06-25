import { Button, Container, Grid, TextField, Typography } from "@mui/material";
import Itinerary from "./Itinerary/Itinerary";
// import LogList from "./LogList";
import { getCustomLocalDate } from "../../components/DateFunctions";
import { useEffect, useState } from "react";

// Queries and Mutations
import { GET_STICKY_NOTE } from "../../models/settings";
import { UPDATE_STICKY_NOTE } from "../../models/settings";
import { useMutation, useQuery } from "@apollo/client";



const TodayPage = () => {
	const [stickyNote, setStickyNote] = useState<string>("");
	

	// Sticky Note Query
	const { data } = useQuery(GET_STICKY_NOTE, {
		onCompleted: (data) => {
			setStickyNote(
				data.stickyNote
			);
		},
	});

	const [updateStickyNote] = useMutation(UPDATE_STICKY_NOTE);
	const handleStickyNoteSave = () => {
		updateStickyNote({
			variables: {
				stickyNote: stickyNote,
			},
			onCompleted: () => {
				console.log("Sticky Note Saved");
			},
			onError: (error) => {
				console.log(error);
			}
		});
	};


	const handleStickyNoteChange = (e: any) => {
		setStickyNote(e.target.value);
	};





	// Tab Title
	useEffect(() => {
		document.title = "Today - HQ";
	}, []);

	return (
		<>
			<Container>
				<Grid container>
					{/* Day Display */}
					<Grid item xs={12}>
						<Typography variant="h4" sx={{ paddingBottom: 2 }}>
							{getCustomLocalDate()}
						</Typography>
					</Grid>

					{/* Left Side */}
					<Grid item xs={10}>
						<Itinerary />
					</Grid>

					{/* Right side */}
					<Grid item xs={2}>
						<TextField
							id="sticky-note"
							label="Sticky Note"
							multiline
							rows={30}
							variant="outlined"
							fullWidth
							value={stickyNote}
							onChange={(e) => handleStickyNoteChange(e)}
							sx={{ paddingBottom: 2 }}
						/>

						<Button
							variant="contained"
							fullWidth
							onClick={() => handleStickyNoteSave()}
						>
							Save
						</Button>

						{/* <LogList /> */}
					</Grid>
				</Grid>
			</Container>


		</>
	);
};

export default TodayPage;
