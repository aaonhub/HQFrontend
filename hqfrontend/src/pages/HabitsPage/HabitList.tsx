import React, { useState } from "react"
import {
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Paper,
	Checkbox,
	Typography,
	IconButton,
} from "@mui/material"
import { useMutation } from "@apollo/client"
import { useTheme } from "@mui/material/styles"
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

// Icons
import InboxIcon from "@mui/icons-material/Inbox"

// Queries and Mutations
import { CHECK_HABIT } from "../../models/habit"

// Components
import EditHabitDialog from "../../components/EditHabitDialog"

// Models
import Habit from "../../models/habit"


interface HabitListProps {
	habits: Habit[];
	today: string;
	handleClose: () => void;
}

const HabitList: React.FC<HabitListProps> = ({ habits, today, handleClose }) => {
	const [habit, setHabit] = useState<Habit>();

	const theme = useTheme();

	const [createHabitHistory] = useMutation(CHECK_HABIT, {
		onCompleted: (data) => {
			console.log(data)
		},
		onError: (error) => {
			console.log(error)
		}
	});


	const handleEdit = (habit: Habit) => {
		setHabit(habit);
	};

	const sortedHabits = () => {
		if (!habits) return [];

		return [...habits].sort((a, b) => {
			const aIsCompleted = a.countToday;
			const bIsCompleted = b.countToday;

			return aIsCompleted && !bIsCompleted
				? 1
				: !aIsCompleted && bIsCompleted
					? -1
					: 0;
		});
	};

	const minusHabit = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, habit: Habit) => {
		event.stopPropagation();
		createHabitHistory({
			variables: {
				habitId: habit.id,
				currentDate: today,
				quantity: -1,
			},
		});
	};

	const plusHabit = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, habit: Habit) => {
		event.stopPropagation();
		createHabitHistory({
			variables: {
				habitId: habit.id,
				currentDate: today,
				quantity: 1,
			},
		});
	};

	return (
		<>
			<List>
				{sortedHabits().map((item) => {
					const isCompleted = item.countToday;

					return (
						<ListItem key={item.id} disablePadding>
							<Paper
								elevation={1}
								onClick={() => handleEdit(item)}
								sx={{
									width: "100%",
									mb: 1,
									...(isCompleted && {
										backgroundColor: theme.palette.background.default,
									}),
								}}
							>
								<ListItemButton>
									<ListItemIcon>
										<InboxIcon
											sx={{ color: isCompleted ? "grey" : "#3f51b5" }}
										/>
									</ListItemIcon>

									<ListItemText
										primary={item.title}
										sx={{
											...(isCompleted && { textDecoration: "line-through" }),
										}}
									/>

									{/* Minus Button */}
									<IconButton
										onClick={(e) => minusHabit(e, item)}
										size="small"
									>
										<RemoveIcon />
									</IconButton>

									<Typography>
										{item.countToday}
									</Typography>

									{/* Plus Button */}
									<IconButton
										onClick={(e) => plusHabit(e, item)}
										size="small"
									>
										<AddIcon />
									</IconButton>

								</ListItemButton>
							</Paper>
						</ListItem>
					);
				})}
			</List>

			{habit && (
				<EditHabitDialog
					onClose={
						() => {
							setHabit(undefined)
							handleClose()
						}
					}
					habitId={habit.id}
				/>
			)}
		</>
	);
};

export default HabitList;
