import React, { useState } from 'react';
import {
	List,
	ListItem,
	ListItemText,
	Typography,
	Card,
	CardContent,
	Checkbox,
	Input,
	Button,
} from '@mui/material';

import { getCurrentLocalDate } from '../../components/DateFunctions';

// Queries and Mutations
import { useMutation } from '@apollo/client';
import { CHECK_UNCHECK_TODO } from '../../models/inboxitem';
import { CHECK_HABIT } from '../../models/habit';
import { ADD_LOG } from '../../models/log';
import { ADD_TODO_TO_TODAY } from '../../models/inboxitem';

// Models
import SimpleItem from '../../models/simpleitem';



interface ItineraryProps {
	simpleItemArray: SimpleItem[];
	setSimpleItemArray: (newArray: (prevArray: SimpleItem[]) => SimpleItem[]) => void;
	habitsRefetch: () => void;
	inboxRefetch: () => void;
}

const Itinerary: React.FC<ItineraryProps> = ({ simpleItemArray, setSimpleItemArray, habitsRefetch, inboxRefetch }) => {
	console.log(simpleItemArray)
	const [inputValue, setInputValue] = useState('');

	const hasData = simpleItemArray.length > 0

	const [addTodoToToday] = useMutation(ADD_TODO_TO_TODAY)
	const handleAddItem = () => {
		const newItem: SimpleItem = {
			id: String(Date.now()) + 'i',
			title: inputValue,
			startTime: '',
			type: 'inbox',
			completedToday: false,
		};
		setSimpleItemArray((prevArray: SimpleItem[]) => [...prevArray, newItem]);
		addTodoToToday({
			variables: {
				title: newItem.title,
				startDate: getCurrentLocalDate(),
				Completed: false,
			},
		}).then(() => {
			setInputValue('');
			inboxRefetch();
			habitsRefetch();
		});
	};


	const handleCheckItem = (item: SimpleItem) => {
		if (item.type === 'habit') {
			handleCheckHabit(item.id)
		} else {
			handleCheckToDo(item.id)
		}
	}


	const [checkHabit] = useMutation(CHECK_HABIT)
	const [addHabitLog] = useMutation(ADD_LOG)
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
				logTime: new Date().toISOString(),
				habitId: habitId.slice(0, -1),
			},
		})
	}


	const [checkToDo] = useMutation(CHECK_UNCHECK_TODO)
	const [addToDoLog] = useMutation(ADD_LOG)
	const handleCheckToDo = async (todoId: string) => {
		await checkToDo({
			variables: {
				// get rid of the h at the end of the id
				id: todoId.slice(0, -1),
				Completed: true,
			},
		})

		setSimpleItemArray((prevArray: any[]) =>
			prevArray.filter((item) => item.id !== todoId && item.type === 'todo' && !item.completedToday)
		)

		await addToDoLog({
			variables: {
				logTime: new Date().toISOString(),
				todoItemId: todoId.slice(0, -1),
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

				{/* Input Box */}
				<Input
					placeholder="Add item"
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					fullWidth
					onKeyDown={(e) => {
						if (e.key === 'Enter') {
							handleAddItem();
						}
					}}
				/>

				{/* spacer */}
				<div style={{ height: 10 }} />
				

				{/* List */}
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
