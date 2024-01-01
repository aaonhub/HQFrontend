import { useEffect, useState } from "react";
import { useGlobalContext } from "../../App/GlobalContextProvider";
import { useMutation } from "@apollo/client";


// Queries and Mutations
import { UPDATE_SETTINGS } from "../../../models/settings";
import { Button, Card, CardActions, CardContent, TextField } from "@mui/material";

const StickyNote = () => {
    const { setSnackbar, settings } = useGlobalContext();
    const [stickyNote, setStickyNote] = useState<string>(settings.stickyNote);

    useEffect(() => {
        setStickyNote(settings.stickyNote);
    }, [settings]);


    const [updateStickyNote] = useMutation(UPDATE_SETTINGS);
    const handleStickyNoteSave = () => {
        updateStickyNote({
            variables: {
                stickyNote: stickyNote,
            },
            onCompleted: () => {
                console.log("Sticky Note Saved");
                setSnackbar({
                    message: "Sticky Note Saved",
                    open: true,
                    severity: "success",
                });
            },
            onError: (error) => {
                console.log(error);
            }
        });
    };


    const handleStickyNoteChange = (e: any) => {
        setStickyNote(e.target.value);
    };


    return (
        <Card sx={{ borderRadius: 2, margin: 1 }}>

            <CardContent>
                <TextField
                    id="sticky-note"
                    label="Sticky Note"
                    multiline
                    variant="outlined"
                    minRows={20}
                    maxRows={30}
                    fullWidth
                    value={stickyNote}
                    onChange={(e) => handleStickyNoteChange(e)}
                />
            </CardContent>

            <CardActions>
                <Button variant="contained" fullWidth onClick={() => handleStickyNoteSave()}>
                    Save
                </Button>
            </CardActions>

        </Card>
    );
}

export default StickyNote;
