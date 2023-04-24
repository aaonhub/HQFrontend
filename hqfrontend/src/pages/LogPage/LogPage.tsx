import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
	Container,
	Typography,
	Box,
	TextField,
	Button,
	Grid,
	Paper,
	Divider,
	List,
	ListItem,
	ListItemText,
} from '@mui/material';

import { GET_LOGS, ADD_LOG } from './logQueries';

import { format } from 'date-fns';

// Models
import Log from '../../models/log';


const LogPage = () => {
	const [logArray, setLogArray] = useState<Log[]>([])
	const [logText, setLogText] = useState('')

	const { loading, error, refetch } = useQuery(GET_LOGS, {
		variables: {
			limit: 100,
		},
		onCompleted: (data) => {
			const logData = data.logs.data
			const logs = logData.map((log: any) => {
				return new Log(
					log.id,
					log.attributes.Log,
					log.attributes.LogTime,
				)
			})
			setLogArray(logs)
		}
	})

	const [addLog] = useMutation(ADD_LOG)

	const handleAddLog = () => {
		if (logText.trim() !== '') {
			addLog({ variables: { Log: logText, LogTime: new Date() } }).then(() => {
				setLogText('')
			});
			logArray.unshift(new Log('', logText, new Date()))
			refetch()
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

			<Paper elevation={3} sx={{ p: 2 }}>
				<Grid container spacing={2} alignItems="center">
					<Grid item xs={10}>

						{/* Add Log Field */}
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

			<Box mt={4}>
				<List>
					{logArray.map((log: Log, index: number) => {
						const logTime = new Date(log.logTime);
						const prevLog = logArray[index - 1];
						const prevLogTime = prevLog && new Date(prevLog.logTime);
						const isSameDay =
							prevLogTime && logTime.getDate() === prevLogTime.getDate();
						const showDateHeader = !prevLog || !isSameDay;

						return (
							<React.Fragment key={log.id}>
								{showDateHeader && (
									<ListItem>
										<Typography variant="subtitle1" fontWeight="bold">
											{format(logTime, 'EEEE, MMMM d, yyyy')}
										</Typography>
									</ListItem>
								)}
								<ListItem alignItems="flex-start">
									<ListItemText
										primary={
											<>
												<Typography
													variant="body2"
													fontWeight="bold"
													component="span"
												>
													{format(logTime, 'hh:mm a')}
												</Typography>
												<Typography component="span" pl={1}>
													{log.log}
												</Typography>
											</>
										}
									/>
								</ListItem>
								<Divider />
							</React.Fragment>
						);
					})}
				</List>
			</Box>
		</Container>
	);
};


export default LogPage;