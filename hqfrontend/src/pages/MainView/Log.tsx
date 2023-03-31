import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_TODAY_LOGS } from './mainViewQueries';
import { Card, CardContent, Typography } from '@mui/material';

const Log: React.FC = () => {

	const start = new Date();
	start.setHours(0, 0, 0, 0);
	const end = new Date();
	end.setHours(23, 59, 59, 999);

	const { loading, error, data } = useQuery(GET_TODAY_LOGS, {
		variables: { Start: start, End: end },
	});

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
						{data.logs.data.map((log: any) => (
							<li key={log.id}>
								{log.attributes.Log} - {new Date(log.attributes.LogTime).toLocaleString()}
							</li>
						))}
					</ul>
				)}
			</CardContent>
		</Card>
	);
};

export default Log;
