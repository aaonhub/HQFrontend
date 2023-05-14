import React, { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { Card, CardContent, TextField, Typography } from '@mui/material'
import { format } from 'date-fns'

// Queries and Mutations
import { GET_TODAY_LOGS, ADD_LOG } from '../../models/log'

// Models
import Log from '../../models/log'


const LogList = () => {
	const [logArray, setLogArray] = useState<Log[]>([])
	const [logText, setLogText] = useState('')


	const { loading, error } = useQuery(GET_TODAY_LOGS, {
		onCompleted: (data) => {
			const logs = data.todayLogs.map((log: any) => {
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
			logArray.unshift(new Log({ id: "", text: logText, logTime: new Date(), type: 'TEXT' }))
		}
	}


	if (loading) return <p>Loading...</p>
	if (error) return <p>Error: {error.message}</p>


	return (
		<Card sx={{ borderRadius: 2, boxShadow: 2, height: '100%', overflow: 'hidden' }}>
			<CardContent>


				<Typography variant="h5" gutterBottom>
					Log
				</Typography>


				<TextField
					fullWidth
					label="Add log"
					value={logText}
					onChange={(e) => setLogText(e.target.value)}
					variant="outlined"
					size="small"
					onKeyDown={(e) => {
						if (e.key === 'Enter') {
							handleAddLog()
						}
					}}
				/>


				{logArray.length === 0 ? (
					<Typography variant="h6" align="center" color="textSecondary">
						Nothing logged today
					</Typography>
				) : (
					<ul>
						{logArray.map((log) => (
							<li key={log.id}>
								<Typography variant="body1" gutterBottom>
									{log.type === 'TEXT' && log.text}
									{log.type === 'COMPLETE_TODOITEM' && `Completed to do item: ${log.toDoItem && log.toDoItem.title}`}
									{log.type === 'COMPLETE_HABIT' && `Completed habit: ${log.habit && log.habit.title}`}
								</Typography>
								<Typography variant="body2" gutterBottom>
									{format(new Date(log.logTime), 'hh:mm a').toString()}
								</Typography>
							</li>
						))}
					</ul>
				)}


			</CardContent>
		</Card>
	)
}

export default LogList