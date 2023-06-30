import { TextField } from "@mui/material";
import React, { useState } from "react";
import { useMutation } from '@apollo/client';
import { useGlobalContext } from "./GlobalContextProvider";

// Queries and Mutations
import { ADD_TODO } from "../../models/inboxitem";
import { ADD_LOG } from "../../models/log";
import { ADD_TODO_TO_TODAY } from "../../models/inboxitem";
import { getCurrentLocalDate } from "../../components/DateFunctions";


interface CommandLineProps {
	setShowCommandLine: React.Dispatch<React.SetStateAction<boolean>>
	commandInputRef: React.RefObject<HTMLInputElement>
}

const CommandLine = ({ setShowCommandLine, commandInputRef }: CommandLineProps) => {
	const { setSnackbar, setLogBadges } = useGlobalContext();
	const [commandInput, setCommandInput] = useState('');
	const [commandType, setCommandType] = useState('Add Log');
	const [placeholderText, setPlaceholderText] = useState('commands');


	const [addLog] = useMutation(ADD_LOG, {
		onCompleted: () => {
			setSnackbar({ open: true, message: 'Log added', severity: 'success' })
			setShowCommandLine(false)
			setCommandInput('')
			setLogBadges([false, false])
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

	const [addToDoToToday] = useMutation(ADD_TODO_TO_TODAY, {
		onCompleted: () => {
			setSnackbar({ open: true, message: 'To do added to today', severity: 'success' })
			setShowCommandLine(false)
			setCommandInput('')
		},
		onError: (error) => {
			console.log(error);
		}
	})


	// Sets command type
	const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {

		// Set Command Input
		setCommandInput(event.target.value)

		// Get the new character
		const newChar = event.target.value[event.target.value.length - 1]


		// Set Command Type
		if (newChar === ' ') {
			// To Do
			if (commandInput === 't') {
				setCommandType('Add To Do')
				setCommandInput('')
				setPlaceholderText('Add To Do')
			}

			// To Do Today
			if (commandInput === 'tt') {
				setCommandType('Add To Do Today')
				setCommandInput('')
				setPlaceholderText('Add To Do Today')
			}
		}


	}

	// Handle Commands
	const handleKeydown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		// Escape
		if (event.key === 'Escape') {
			setShowCommandLine(false);
			setCommandInput('')
		}

		// Backspace
		if (event.key === 'Backspace' && commandInput === '') {
			if (commandType === 'Add To Do') {
				event.preventDefault()
				setCommandInput('t')
				setCommandType('Log')
				setPlaceholderText('commands')
			}

			if (commandType === 'Add To Do Today') {
				event.preventDefault()
				setCommandInput('tt')
				setCommandType('Log')
				setPlaceholderText('commands')
			}
		}

		// Enter Command
		if (event.key === 'Enter') {

			// Nothing happens
			if (commandInput === '') {
				return
			}

			// Add Log
			if (commandType === 'Add Log') {
				addLog({
					variables: {
						text: commandInput,
						logTime: new Date()
					}
				})
			}

			// Add To Do
			if (commandType === 'Add To Do') {
				addTodo({
					variables: {
						title: commandInput,
					}
				})
			}

			// Add To Do To Today
			if (commandType === 'Add To Do Today') {
				addToDoToToday({
					variables: {
						title: commandInput,
						startDate: getCurrentLocalDate(),
						Completed: false,
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
				zIndex: 1000,
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
					zIndex: 1000,
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
				onKeyDown={handleKeydown}
			/>
		</>
	)


}

export default CommandLine;