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
import { COMPLETE_UNCOMPLETE_TODO } from '../../models/inboxitem';
import { CHECK_HABIT } from '../../models/habit';
import { ADD_HABIT_LOG } from '../../models/log';
import { ADD_TODO_LOG } from '../../models/log';


// Models
import SimpleItem from '../../models/simpleitem';


interface ItineraryProps {
	simpleItemArray: SimpleItem[];
	setSimpleItemArray: (newArray: (prevArray: SimpleItem[]) => SimpleItem[]) => void;
}

const Itinerary: React.FC<ItineraryProps> = ({ simpleItemArray, setSimpleItemArray }) => {
	const hasData = simpleItemArray.length > 0

	const [checkHabit] = useMutation(CHECK_HABIT)
	const [checkToDo] = useMutation(COMPLETE_UNCOMPLETE_TODO)
	const [addHabitLog] = useMutation(ADD_HABIT_LOG)
	const [addToDoLog] = useMutation(ADD_TODO_LOG)

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
				// get rid of the h at the end of the id
				habitId: habitId.slice(0, -1),
				currentDate: getCurrentLocalDate(),
			},
		})

		setSimpleItemArray((prevArray: SimpleItem[]) =>
		// remove the item from the array
			prevArray.filter((item) => item.id !== habitId && item.type === 'habit' && !item.completedToday)
		)

		await addHabitLog({
			variables: {
				LogTime: new Date().toISOString(),
				Habit: habitId.slice(0, -1),
			},
		})
	}

	const handleCheckToDo = async (todoId: string) => {
		console.log(todoId)
		await checkToDo({
			variables: {
				// get rid of the h at the end of the id
				toDoId: todoId.slice(0, -1),
				Completed: true,
			},
		})

		setSimpleItemArray((prevArray: any[]) =>
			prevArray.filter((item) => item.id !== todoId && item.type === 'todo' && !item.completedToday)
		)

		await addToDoLog({
			variables: {
				LogTime: new Date().toISOString(),
				ToDoItem: todoId.slice(0, -1),
			},
		})

	}

	return (
		<Card
			sx={{
				borderRadius: 2,
				boxShadow: 2,
				height: '90%',
				marginRight: 2,
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
