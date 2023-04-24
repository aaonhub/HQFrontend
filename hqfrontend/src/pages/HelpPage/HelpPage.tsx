import React from 'react';
import { Box, Typography, Container } from '@mui/material';

const HelpPage = () => {
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
				</Typography>
				<ol>
					<li>
						<Typography variant="body1" component="div">
							Sign up for an account or log in to your existing account.
						</Typography>
					</li>
					<li>
						<Typography variant="body1" component="div">
							Create a new project or join an existing project.
						</Typography>
					</li>
					<li>
						<Typography variant="body1" component="div">
							Start adding tasks and assigning them to team members.
						</Typography>
					</li>
				</ol>
				<Typography variant="h6" component="h2" gutterBottom>
					Managing Tasks
				</Typography>
				<Typography variant="body1" gutterBottom>
					Manage your tasks by following these steps:
				</Typography>
				<ol>
					<li>
						<Typography variant="body1" component="div">
							Add new tasks with a title, description, and due date.
						</Typography>
					</li>
					<li>
						<Typography variant="body1" component="div">
							Mark tasks as complete by clicking the checkbox next to the task.
						</Typography>
					</li>
					<li>
						<Typography variant="body1" component="div">
							Delete tasks by clicking the delete icon next to the task.
						</Typography>
					</li>
					<li>
						<Typography variant="body1" component="div">
							Edit tasks by clicking on the task and updating the details.
						</Typography>
					</li>
				</ol>
				<Typography variant="h6" component="h2" gutterBottom>
					Need more help?
				</Typography>
				<Typography variant="body1" gutterBottom>
					If you need further assistance, please contact our support team at
					support@example.com.
				</Typography>
			</Box>
		</Container>
	);
};

export default HelpPage;
