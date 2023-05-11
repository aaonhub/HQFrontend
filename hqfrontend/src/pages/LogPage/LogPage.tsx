import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { Container, Typography, Box, TextField, Button, Grid, Paper, List } from '@mui/material'
import LogItem from './LogItem'

// Queries and Mutations
import {
	GET_LOGS,
	ADD_LOG
} from '../../models/log'

// Models
import Log from '../../models/log'


const LogPage = () => {
	const [logArray, setLogArray] = useState<Log[]>([])
	const [logText, setLogText] = useState('')




	// Get logs query
	const { loading, error, refetch } = useQuery(GET_LOGS, {
		onCompleted: (data) => {
			const logs = data.logs.map((log: any) => {
				const newLog = new Log({
					id: log.id,
					logTime: log.logTime,
					type: log.type,
				})

				if (log.type === "TEXT") {
					newLog.text = log.text
				} else if (log.type === 'COMPLETE_TODOITEM') {
					newLog.toDoItem = {
						id: log.completeTodoitem.id,
						title: log.completeTodoitem.title,
					}
				} else if (log.type === 'COMPLETE_HABIT') {
					newLog.habit = {
						id: log.completeHabit.id,
						title: log.completeHabit.title,
					}
				}
				return newLog

			})
			setLogArray(logs)
		}
	})



	// Add log mutation
	const [addTextLog] = useMutation(ADD_LOG)
	const handleAddLog = () => {
		if (logText.trim() !== '') {

			addTextLog({
				variables: {
					text: logText,
					logTime: new Date(),
				}
			}).then(() => {
				setLogText('')
			})

			logArray.unshift(new Log({ id: '', text: logText, logTime: new Date(), type: 'TEXT' }))

			refetch()
		}
	}




	if (loading) return <div>Loading...</div>
	if (error) return <div>Error! {error.message}</div>




	return (
		<Container maxWidth="md">
			<Box mt={5} mb={3}>
				<Typography variant="h4" align="center">
					Log Page
				</Typography>
			</Box>


			{/* Add Log Field */}
			<Paper elevation={3} sx={{ p: 2 }}>
				<Grid container spacing={2} alignItems="center">


					{/* Add Log Field */}
					<Grid item xs={10}>
						<TextField
							fullWidth
							label="Add log"
							value={logText}
							onChange={(e) => setLogText(e.target.value)}
							variant="outlined"
							size="small"
							onKeyDown={(e) => {
								if (e.key === 'Enter') {
									handleAddLog();
								}
							}}
						/>
					</Grid>



					{/* Add Log Button */}
					<Grid item xs={2}>
						<Button
							fullWidth
							variant="contained"
							onClick={handleAddLog}
							size="medium"
						>
							Add
						</Button>
					</Grid>
				</Grid>
			</Paper>



			{/* Log List */}
			<Box mt={4}>
				<List>
					{logArray.map((log: Log, index: number) => {
						return (
							<LogItem key={log.id} log={log} prevLog={logArray[index - 1]} />
						);
					})}
				</List>
			</Box>
		</Container>
	);
};


export default LogPage;