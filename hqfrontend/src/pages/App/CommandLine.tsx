import { TextField } from "@mui/material";
import React, { useState } from "react";
import { useQuery, useMutation } from '@apollo/client';
import { useGlobalContext } from "./GlobalContextProvider";

// Queries and Mutations
import { ADD_TODO } from "../../models/inboxitem";
import { ADD_LOG } from "../../models/log";


interface CommandLineProps {
    setShowCommandLine: React.Dispatch<React.SetStateAction<boolean>>
    commandInputRef: React.RefObject<HTMLInputElement>
}

const CommandLine = ({ setShowCommandLine, commandInputRef }: CommandLineProps) => {
    const { setSnackbar } = useGlobalContext();
    const [commandInput, setCommandInput] = useState('');
    const [commandType, setCommandType] = useState('log');


    const [addLog] = useMutation(ADD_LOG, {
        onCompleted: (data) => {
            console.log(data);
            setSnackbar({ open: true, message: 'Log added', severity: 'success' })
            setShowCommandLine(false)
            setCommandInput('')
        },
        onError: (error) => {
            console.log(error);
        }
    })



    const handleEnter = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {

            
            // Log
            if (commandType === 'log') {
                addLog({
                    variables: {
                        text: commandInput,
                        logTime: new Date()
                    }
                })
            }


        }
    }





    return (
        <TextField
            inputRef={commandInputRef}
            sx={{
                position: 'fixed',
                bottom: 0,
                left: 240,
                right: 0,
                backgroundColor: '#171717',
                padding: 1,
            }}
            InputProps={{
                sx: {
                    color: "#fff",
                    borderRadius: 2
                }
            }}
            autoComplete='off'
            variant="outlined"
            autoFocus
            value={commandInput}
            onChange={(event) => setCommandInput(event.target.value)}
            placeholder="commands"
            onBlur={() => { setShowCommandLine(false); setCommandInput('') }}
            onKeyDown={handleEnter}
        />
    )
}

export default CommandLine;