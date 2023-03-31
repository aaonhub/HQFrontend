import React from 'react';
import {
	List,
	ListItem,
	ListItemText,
	Typography,
	Card,
	CardContent,
} from '@mui/material';

interface ToDoItemAttributes {
	Title: string;
	Completed: boolean;
	StartDate: string;
}

interface ToDoItem {
	id: string;
	attributes: ToDoItemAttributes;
}

interface ItineraryProps {
	data: {
		toDoItems: {
			data: ToDoItem[];
		};
	};
}

const Itinerary: React.FC<ItineraryProps> = ({ data }) => {
	const hasData = data.toDoItems.data.length > 0;

	return (
		<Card
			sx={{
				borderRadius: 2,
				boxShadow: 2,
				height: '90%',
			}}
		>
			<CardContent>
				<Typography variant="h5" gutterBottom>
					Itinerary
				</Typography>
				{hasData ? (
					<List>
						{data.toDoItems.data.map((item: ToDoItem) => (
							<ListItem key={item.id}>
								<ListItemText
									primary={item.attributes.Title}
									secondary={`Start Date: ${item.attributes.StartDate}`}
								/>
							</ListItem>
						))}
					</List>
				) : (
					<Typography variant="h6" align="center" color="textSecondary">
						Nothing left to do
					</Typography>
				)}
			</CardContent>
		</Card>
	);
};

export default Itinerary;
