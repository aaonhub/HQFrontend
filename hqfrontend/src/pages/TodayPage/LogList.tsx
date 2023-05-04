import React, { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { Card, CardContent, TextField, Typography } from '@mui/material'
import { format } from 'date-fns'

// Queries and Mutations
import { GET_TODAY_LOGS, ADD_TEXT_LOG } from '../../models/log'

// Models
import Log from '../../models/log'


const LogList = () => {
	const [logArray, setLogArray] = useState<Log[]>([])
	const [logText, setLogText] = useState('')

	const start = new Date()
	start.setHours(0, 0, 0, 0)
	const end = new Date()
	end.setHours(23, 59, 59, 999)

	const { loading, error, data, refetch } = useQuery(GET_TODAY_LOGS, {
		variables: {
			Start: start.toISOString(),
			End: end.toISOString(),
		},
		onCompleted: (data1) => {
			const logData = data1.logs.data
			const logs = logData.map((log: any) => {
				return new Log({
					id: log.id,
					text: log.attributes.Text,
					logTime: log.attributes.LogTime,
					type: log.attributes.Type,
				})
			})
			setLogArray(logs)
		}
	})

	// Add log mutation
	const [addLog] = useMutation(ADD_TEXT_LOG)
	const handleAddLog = () => {
		if (logText.trim() !== '') {

			addLog({
				variables: {
					Text: logText,
					LogTime: new Date(),
				}
			}).then(() => {
				setLogText('')
			})

			logArray.unshift(new Log({ id: "", text: logText, logTime: new Date(), type: 'text' }))

			refetch()
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


				{data.logs.data.length === 0 ? (
					<Typography variant="h6" align="center" color="textSecondary">
						Nothing logged today
					</Typography>
				) : (
					<ul>
						{logArray.map((log) => (
							<li key={log.id}>
								<Typography variant="body1" gutterBottom>
									{log.text}
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