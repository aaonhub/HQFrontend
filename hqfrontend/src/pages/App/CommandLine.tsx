import { TextField } from "@mui/material";
import React, { useState } from "react";
import { useMutation } from '@apollo/client';
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
	const [commandType, setCommandType] = useState('Log');
	const [placeholderText, setPlaceholderText] = useState('commands');


	const [addLog] = useMutation(ADD_LOG, {
		onCompleted: () => {
			setSnackbar({ open: true, message: 'Log added', severity: 'success' })
			setShowCommandLine(false)
			setCommandInput('')
		},
		onError: (error) => {
			console.log(error);
		}
	})

	const [addTodo] = useMutation(ADD_TODO, {
		onCompleted: () => {
			setSnackbar({ open: true, message: 'Todo added', severity: 'success' })
			setShowCommandLine(false)
			setCommandInput('')
		},
		onError: (error) => {
			console.log(error);
		}
	})


	// Handle Input
	const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {

		// Set Command Input
		setCommandInput(event.target.value)

		// Get the new character
		const newChar = event.target.value[event.target.value.length - 1]


		// Set Command Type
		if (newChar === ' ') {
			if (commandInput === 't') {
				setCommandType('To Do')
				setCommandInput('')
				setPlaceholderText('Add To Do')
			}
		}


	}

	// Handle Keydown
	const handleKeydown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		// Escape
		if (event.key === 'Escape') {
			setShowCommandLine(false);
			setCommandInput('')
		}

		// Backspace
		if (event.key === 'Backspace' && commandInput === '') {
			if (commandType === 'To Do') {
				event.preventDefault()
				setCommandInput('t')
				setCommandType('Log')
				setPlaceholderText('commands')
			}
		}

		// Enter
		if (event.key === 'Enter') {

			// 
			if (commandInput === '') {
				return
			}


			// Add Log
			if (commandType === 'log') {
				addLog({
					variables: {
						text: commandInput,
						logTime: new Date()
					}
				})
			}


			// Add To Do
			if (commandType === 'todo') {
				addTodo({
					variables: {
						title: commandInput,
					}
				})
			}


		}
	}




	return (
		<>

			<div style={{
				position: 'fixed',
				bottom: '70px', // Adjust this value according to the height of your TextField
				left: 240,
				right: 0,
				color: "#fff",
				backgroundColor: '#171717',
				padding: '10px',
				textAlign: 'left',
				width: '15%',
			}}>
				Current Command: {commandType}
			</div>

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
				onChange={handleInput}
				placeholder={placeholderText}
				onBlur={() => { setShowCommandLine(false); setCommandInput('') }}
				onKeyDown={handleKeydown}
			/>
		</>
	)


}

export default CommandLine;