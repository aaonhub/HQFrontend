import { SetStateAction, useEffect, useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import {
	Container,
	Typography, Box, TextField, Button, Grid, Paper, List, FilledTextFieldProps,
	OutlinedTextFieldProps, StandardTextFieldProps, TextFieldVariants
} from '@mui/material'
import LogItem from './LogItem'

// Queries and Mutations
import {
	GET_LOGS,
	ADD_LOG
} from '../../models/log'

// Models
import Log from '../../models/log'
import { JSX } from 'react/jsx-runtime';


const LogPage = () => {

	// Tab Title
	useEffect(() => {
		document.title = "Log - HQ";
	}, []);

	const [logArray, setLogArray] = useState<Log[]>([])
	const [logText, setLogText] = useState('')
	const [logTime, setLogTime] = useState(new Date().toISOString().slice(0, 16));


	// Get logs query
	const { loading, error, refetch } = useQuery(GET_LOGS, {
		onCompleted: (data) => {
			const logs = data.logs.map((log: any) => {
				const newLog = new Log({
					id: log.id,
					logTime: log.logTime,
				})

				newLog.text = log.text

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
					logTime: new Date(logTime),
				},
			}).then(() => {
				setLogText('');
				setLogTime(new Date().toISOString().slice(0, 16));
			});
			logArray.unshift(new Log({ id: '', text: logText, logTime: new Date(logTime) }));
			refetch();
		}
	};




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
					<Grid item xs={7}>
						<TextField
							fullWidth
							label="Add log"
							value={logText}
							onChange={(e) => setLogText(e.target.value)}
							variant="outlined"
							autoComplete="off"
							size="small"
							onKeyDown={(e) => {
								if (e.key === 'Enter') {
									handleAddLog();
								}
							}}
						/>
					</Grid>
					{/* Add DateTime Input */}
					<Grid item xs={3}>
						<input
							type="datetime-local"
							value={logTime}
							onChange={(e) => setLogTime(e.target.value)}
							style={{
								width: '100%',
								padding: '8px',
								backgroundColor: '#333',
								color: '#fff',
								border: 'none',
								borderRadius: '4px',
							}}
						/>
					</Grid>
					{/* Add Log Button */}
					<Grid item xs={2}>
						<Button fullWidth variant="contained" onClick={handleAddLog} size="medium">
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