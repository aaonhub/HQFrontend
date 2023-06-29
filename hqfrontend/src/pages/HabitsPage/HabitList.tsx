import React, { useState } from "react"
import {
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Paper,
	Checkbox,
} from "@mui/material"
import { useMutation } from "@apollo/client"
import { useTheme } from "@mui/material/styles"

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

	const [createHabitHistory] = useMutation(CHECK_HABIT);
	const handleHabitCompletion = (habit: Habit) => {
		createHabitHistory({
			variables: {
				habitId: habit.id,
				currentDate: today,
			},
		});
		habit.completedToday = true;
	};

	const handleEdit = (habit: Habit) => {
		setHabit(habit);
	};

	const sortedHabits = () => {
		if (!habits) return [];

		return [...habits].sort((a, b) => {
			const aIsCompleted = a.completedToday;
			const bIsCompleted = b.completedToday;

			return aIsCompleted && !bIsCompleted
				? 1
				: !aIsCompleted && bIsCompleted
					? -1
					: 0;
		});
	};

	return (
		<>
			<List>
				{sortedHabits().map((item) => {
					const isCompleted = item.completedToday;

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

									<Checkbox
										edge="end"
										checked={isCompleted}
										onChange={() => handleHabitCompletion(item)}
										onClick={(e) => e.stopPropagation()}
										color="primary"
									/>
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
