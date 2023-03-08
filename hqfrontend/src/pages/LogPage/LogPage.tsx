import React, { useState, useEffect } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { List, ListItem, ListItemText, TextField, Button } from '@mui/material';
import { GET_LOGS, ADD_LOG } from './logQueries';
import { format } from 'date-fns';

interface Props {
	// add any props here
}

const LogPage: React.FC<Props> = (props: Props) => {
	const [getLogs, { loading, data }] = useLazyQuery(GET_LOGS);
	const [addLog] = useMutation(ADD_LOG);
	const [logText, setLogText] = useState('');

	useEffect(() => {
		const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString();
		getLogs({ variables: { LogTime: twoDaysAgo } });
	}, [getLogs]);

	const handleAddLog = () => {
		if (logText.trim() !== '') {
			addLog({ variables: { Log: logText, LogTime: new Date() } }).then(() => {
				setLogText('');
				getLogs();
			});
		}
	};

	console.log(data);

	return (
		<div>
			<h1>Log Page</h1>
			{/* Add a MUI text input with button attached for adding to the log */}
			<TextField
				label="Add log"
				value={logText}
				onChange={(e) => setLogText(e.target.value)}
				
				//submit on enter
				onKeyDown={(e) => {
					if (e.key === 'Enter') {
						handleAddLog();
					}
				}}
			/>
			<Button variant="contained" onClick={handleAddLog}>
				Add
			</Button>

			{/* Add a MUI list of all the logs */}
			<List>
				{data?.logs?.data?.map((log: any) => (
					<ListItem key={log.id}>
						<ListItemText
							primary={log.attributes.Log}
							secondary={format(new Date(log.attributes.LogTime), 'MMM d, yyyy h:mm a')}
							secondaryTypographyProps={{ component: 'div' }}
							title={format(new Date(log.attributes.LogTime), 'yyyy-MM-dd HH:mm:ss.SSS')}
						/>
					</ListItem>
				))}
			</List>
		</div>
	);
};

export default LogPage;
