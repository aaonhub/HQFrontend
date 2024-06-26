import { useEffect } from 'react';
import { Box, Typography, Container } from '@mui/material';

const HelpPage = () => {
	// Tab Title
	useEffect(() => {
		document.title = "Help - HQ";
	}, []);
	
	return (
		<Container maxWidth="md">
			<Box sx={{ mt: 4, mb: 4 }}>
				<Typography variant="h4" component="h1" gutterBottom>
					no
				</Typography>
			</Box>
		</Container>
	);
};

export default HelpPage;
