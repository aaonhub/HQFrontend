import React from "react";
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, Checkbox } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import InboxIcon from "@mui/icons-material/Inbox";

interface HabitItem {
	id: string;
	title: string;
	completedToday: boolean;
}

interface HabitListProps {
	habits: HabitItem[];
	onHabitCompletion: (habit: HabitItem) => void;
}

const HabitList: React.FC<HabitListProps> = ({ habits, onHabitCompletion }) => {
	const theme = useTheme();

	return (
		<List>
			{habits.map((habit) => (
				<ListItem key={habit.id} disablePadding>
					<Paper
						elevation={1}
						onClick={() => onHabitCompletion(habit)}
						sx={{
							width: "100%",
							mb: 1,
							...(habit.completedToday && {
								backgroundColor: theme.palette.background.default,
							}),
						}}
					>
						<ListItemButton>
							<ListItemIcon>
								<InboxIcon sx={{ color: habit.completedToday ? "grey" : "#3f51b5" }} />
							</ListItemIcon>

							<ListItemText
								primary={habit.title}
								sx={{
									...(habit.completedToday && { textDecoration: "line-through" }),
								}}
							/>

							<Checkbox
								edge="end"
								checked={habit.completedToday}
								onChange={() => onHabitCompletion(habit)}
								onClick={(e) => e.stopPropagation()}
								color="primary"
							/>
						</ListItemButton>
					</Paper>
				</ListItem>
			))}
		</List>
	);
};

// Dummy data for testing
const dummyHabits: HabitItem[] = [
	{ id: "1", title: "Exercise", completedToday: false },
	{ id: "2", title: "Read a book", completedToday: true },
	{ id: "3", title: "Drink water", completedToday: false },
];

const TestPage: React.FC = () => {
	const handleHabitCompletion = (habit: HabitItem) => {
		console.log("Habit completed:", habit.title);
	};

	return (
		<HabitList habits={dummyHabits} onHabitCompletion={handleHabitCompletion} />
	);
};

export default TestPage;
