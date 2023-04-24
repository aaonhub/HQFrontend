import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { Card, CardContent, Typography } from '@mui/material';
import { format } from 'date-fns';

// Queries and Mutations
import { GET_TODAY_LOGS } from '../../models/log';

// Models
import Log from '../../models/log';


const LogList = () => {
	const [logArray, setLogArray] = useState<Log[]>([]);

	const start = new Date();
	start.setHours(0, 0, 0, 0);
	const end = new Date();
	end.setHours(23, 59, 59, 999);

	const { loading, error, data } = useQuery(GET_TODAY_LOGS, {
		variables: {
			Start: start.toISOString(),
			End: end.toISOString(),
		},
		onCompleted: (data1) => {
			const logData = data1.logs.data;
			const logs = logData.map((log: any) => {
				return new Log(log.id, log.attributes.Log, log.attributes.LogTime, log.attributes.LogType);
			});
			setLogArray(logs);
		}
	});

	console.log(logArray)


	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error: {error.message}</p>;

	return (
		<Card sx={{ borderRadius: 2, boxShadow: 2, height: '100%', overflow: 'hidden' }}>
			<CardContent>
				<Typography variant="h5" gutterBottom>
					Log
				</Typography>
				{data.logs.data.length === 0 ? (
					<Typography variant="h6" align="center" color="textSecondary">
						Nothing logged today
					</Typography>
				) : (
					<ul>
						{logArray.map((log) => (
							<li key={log.id}>
								<Typography variant="body1" gutterBottom>
									{log.log}
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
	);
};

export default LogList;
