import { TextField } from "@mui/material";
import React, { useState } from "react";

interface CommandLineProps {
    setShowCommandLine: React.Dispatch<React.SetStateAction<boolean>>
    commandInputRef: React.RefObject<HTMLInputElement>
}

const CommandLine = ({ setShowCommandLine, commandInputRef }: CommandLineProps) => {
    const [commandInput, setCommandInput] = useState('');







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
        />
    )
}

export default CommandLine;