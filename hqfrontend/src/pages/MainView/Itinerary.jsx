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

import { useMutation } from '@apollo/client';
import { CHECK_TODO } from './mainViewQueries';
import { CHECK_HABIT } from './mainViewQueries';

import { getCurrentLocalDate } from '../../components/DateFunctions';

const Itinerary = ({ habitInboxArray }) => {
	const hasData = habitInboxArray.length > 0

	const [checkHabit] = useMutation(CHECK_HABIT)
	const [checkToDo] = useMutation(CHECK_TODO)

	console.log(habitInboxArray)

	const handleCheckItem = (item) => {
		if (item.type === 'habit') {
			handleCheckHabit(item.id)
		} else {
			handleCheckToDo(item.id)
		}
	}

	const handleCheckHabit = (habitId) => {
		checkHabit({
			variables: {
				habitId: habitId,
				date: getCurrentLocalDate(),
			},
		})
	}

	const handleCheckToDo = (todoId) => {
		checkToDo({
			variables: {
				todoId: todoId,
			},
		})
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
						{habitInboxArray.map((item) => (
							<ListItem key={item.id} disablePadding>
								<Checkbox
									checked={item.completedToday}
									onChange={() => handleCheckItem(item)}
								/>
								<ListItemText
									primary={item.title}
									secondary={item.startTime ? item.startTime : null}
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
