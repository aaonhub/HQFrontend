import React, { useState } from "react";
import {
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Paper,
	Checkbox,
} from "@mui/material";
import { useMutation } from "@apollo/client";

// Icons
import InboxIcon from "@mui/icons-material/Inbox";

// Queries and Mutations
import { CREATE_HABIT_HISTORY } from "../../models/habit";

// Components
import EditHabitDialog from "./EditHabitDialog";
import { getCurrentLocalDate } from "../../components/DateFunctions";

// Models
import Habit from "../../models/habit";


interface HabitListProps {
	refetch: () => void;
	habits: Habit[];
	today: string;
}

const HabitList: React.FC<HabitListProps> = ({ refetch, habits, today }) => {
	const [habit, setHabit] = useState<Habit>();

	const [createHabitHistory] = useMutation(CREATE_HABIT_HISTORY);

	const handleHabitCompletion = (habit: Habit) => {
		createHabitHistory({
			variables: {
				data: {
					Date: today,
					habit: habit.id,
					Completed: true,
				},
				habitId: habit.id,
				lastCompleted: today === getCurrentLocalDate() ? today : habit.lastCompleted,
			},
		})
		habit.completedToday = true;
	};

	const handleEdit = (habit: Habit) => {
		setHabit(habit);
	};

	const sortedHabits = () => {
		if (!habits) return [];

		return [...habits].sort((a, b) => {
			const aHabitHistories = a?.habitHistories || [];
			const bHabitHistories = b?.habitHistories || [];

			const aIsCompleted = aHabitHistories.some(
				(history) => history.completed
			);
			const bIsCompleted = bHabitHistories.some(
				(history) => history.completed
			);

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

					const isCompleted = item.habitHistories &&
						item.habitHistories.length > 0 &&
						item.habitHistories[0].completed

					return (
						<ListItem key={item.id} disablePadding>
							<Paper
								elevation={1}
								onClick={() => handleEdit(item)}
								sx={{
									width: "100%",
									mb: 1,
									...(isCompleted && { backgroundColor: "lightgrey" }),
								}}
							>
								<ListItemButton>
									<ListItemIcon>
										<InboxIcon sx={{ color: isCompleted ? "grey" : "#3f51b5" }} />
									</ListItemIcon>
									<ListItemText primary={item.title} />
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
					onClose={() => setHabit(undefined)}
					habit={habit}
					refetch={refetch}
				/>
			)}

		</>
	);
};

export default HabitList;
