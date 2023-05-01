import React from 'react';
import {
	List,
	ListItem,
	ListItemText,
	Typography,
	Card,
	CardContent,
	Checkbox,
} from '@mui/material';

import { getCurrentLocalDate } from '../../components/DateFunctions';

// Queries and Mutations
import { useMutation } from '@apollo/client';
import { CHECK_TODO } from './mainViewQueries';
import { CHECK_HABIT } from './mainViewQueries';

// Models
import SimpleItem from '../../models/simpleitem';


interface ItineraryProps {
	simpleItemArray: SimpleItem[];
	setSimpleItemArray: (newArray: (prevArray: SimpleItem[]) => SimpleItem[]) => void;
}

const Itinerary: React.FC<ItineraryProps> = ({ simpleItemArray, setSimpleItemArray }) => {
	const hasData = simpleItemArray.length > 0

	const [checkHabit] = useMutation(CHECK_HABIT)
	const [checkToDo] = useMutation(CHECK_TODO)

	const handleCheckItem = (item: SimpleItem) => {
		if (item.type === 'habit') {
			handleCheckHabit(item.id)
		} else {
			handleCheckToDo(item.id)
		}
	}

	const handleCheckHabit = async (habitId: string) => {
		await checkHabit({
			variables: {
				habitId: habitId,
				date: getCurrentLocalDate(),
			},
		})

		setSimpleItemArray((prevArray: SimpleItem[]) =>
		// remove the item from the array
			prevArray.filter((item) => item.id !== habitId && item.type === 'habit' && !item.completedToday)
		)
	}

	const handleCheckToDo = async (todoId: string) => {
		await checkToDo({
			variables: {
				todoId: todoId,
			},
		})

		setSimpleItemArray((prevArray: any[]) =>
			prevArray.filter((item) => item.id !== todoId && item.type === 'todo' && !item.completedToday)
		)
	}

	return (
		<Card
			sx={{
				borderRadius: 2,
				boxShadow: 2,
				height: '90%',
			}}
		>
			<CardContent
				sx={{
					height: '100%',
					overflow: 'auto',
				}}
			>
				<Typography variant="h5" gutterBottom>
					Itinerary
				</Typography>
				{hasData ? (
					<List sx={{ padding: 0 }}>
						{simpleItemArray.map((item) => (
							<ListItem key={item.id} disablePadding>
								<Checkbox
									checked={item.completedToday}
									onChange={() => handleCheckItem(item)}
								/>
								<ListItemText
									primary={item.title}
									secondary={item.startTime}
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
