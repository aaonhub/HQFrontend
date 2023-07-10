import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import {
	Card,
	CardContent,
	TextField,
	Typography,
	IconButton,
	List,
	ListItem,
	ListItemText
} from '@mui/material'
import SendIcon from '@mui/icons-material/Send';
import { format } from 'date-fns'
import DeleteIcon from '@mui/icons-material/Delete';

import { GET_TODAY_LOGS, ADD_LOG, DELETE_LOG } from '../../models/log'
import Log from '../../models/log'
import { useGlobalContext } from '../App/GlobalContextProvider';

const LogList = () => {
	const { setSnackbar } = useGlobalContext()
	const [logArray, setLogArray] = useState<Log[]>([])
	const [logText, setLogText] = useState('')


	// Log Query
	const { loading, error } = useQuery(GET_TODAY_LOGS, {
		onCompleted: (data) => {
			const logs = data.todayLogs.map((log: any) => {
				const newLog = new Log({
					id: log.id,
					logTime: log.logTime,
					text: log.text,
				})
				
				return newLog

			})
			setLogArray(logs)
		}
	})


	// Add Log Mutation
	const [addLog] = useMutation(ADD_LOG, {
		onError: (error) => console.log(error.networkError),
		onCompleted: () => {
			setLogText('')
		},
		refetchQueries: [{ query: GET_TODAY_LOGS }],
	})
	const handleAddLog = () => {
		if (logText.trim() !== '') {

			addLog({
				variables: {
					text: logText,
					logTime: new Date(),
				}
			})
			logArray.unshift(new Log({ id: "", text: logText, logTime: new Date() }))
		}
	}


	// Delete Log Mutation
	const [deleteLog] = useMutation(DELETE_LOG, {
		onError: (error) => {
			console.log(error.networkError)
			setSnackbar({
				open: true,
				message: 'Error deleting log',
				severity: 'error',
			})
		},
		refetchQueries: [{ query: GET_TODAY_LOGS }],
	})
	const handleDeleteLog = (logId: string) => {
		deleteLog({
			variables: {
				id: logId
			},
			onCompleted: () => {
				setSnackbar({
					open: true,
					message: 'Log deleted',
					severity: 'success',
				})
				setLogArray(logArray.filter(log => log.id !== logId))
			}
		})
	}


	if (loading) return <p>Loading...</p>
	if (error) return <p>Error: {error.message}</p>

	return (
		<Card sx={{ borderRadius: 2, boxShadow: 2, height: '100%', overflow: 'hidden' }}>
			<CardContent>
				<Typography variant="h5" gutterBottom>Log</Typography>

				<TextField
					label="Add log"
					value={logText}
					onChange={(e) => setLogText(e.target.value)}
					variant="outlined"
					size="small"
					autoComplete="off"
					style={{ width: '90%' }}
					onKeyDown={(e) => {
						if (e.key === 'Enter') {
							handleAddLog()
						}
					}}
				/>
				<IconButton onClick={handleAddLog} color="primary" aria-label="send log">
					<SendIcon />
				</IconButton>

				{logArray.length === 0 ? (
					<Typography variant="h6" align="center" color="textSecondary">
						Nothing logged today
					</Typography>
				) : (
					<List>
						{logArray.map((log) => (
							<ListItem key={log.id}>
								<ListItemText
									primary={log.text}
									secondary={format(new Date(log.logTime), 'hh:mm a').toString()}
								/>
								<IconButton onClick={() => handleDeleteLog(log.id)} color="secondary" aria-label="delete log">
									<DeleteIcon />
								</IconButton>
							</ListItem>
						))}
					</List>
				)}
			</CardContent>
		</Card>
	)
}

export default LogList
