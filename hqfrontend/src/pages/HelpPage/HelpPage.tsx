import React from 'react';
import { Box, Typography, Container } from '@mui/material';

const HelpPage: React.FC = () => {
	return (
		<Container maxWidth="md">
			<Box sx={{ mt: 4, mb: 4 }}>
				<Typography variant="h4" component="h1" gutterBottom>
					Help Page
				</Typography>
				<Typography variant="h6" component="h2" gutterBottom>
					Getting Started
				</Typography>
				<Typography variant="body1" gutterBottom>
					To get started, follow these simple steps:
					<ol>
						<li>Sign up for an account or log in to your existing account.</li>
						<li>Create a new project or join an existing project.</li>
						<li>Start adding tasks and assigning them to team members.</li>
					</ol>
				</Typography>
				<Typography variant="h6" component="h2" gutterBottom>
					Managing Tasks
				</Typography>
				<Typography variant="body1" gutterBottom>
					Manage your tasks by following these steps:
					<ol>
						<li>Add new tasks with a title, description, and due date.</li>
						<li>Mark tasks as complete by clicking the checkbox next to the task.</li>
						<li>Delete tasks by clicking the delete icon next to the task.</li>
						<li>Edit tasks by clicking on the task and updating the details.</li>
					</ol>
				</Typography>
				<Typography variant="h6" component="h2" gutterBottom>
					Need more help?
				</Typography>
				<Typography variant="body1" gutterBottom>
					If you need further assistance, please contact our support team at support@example.com.
				</Typography>
			</Box>
		</Container>
	);
};

export default HelpPage;
