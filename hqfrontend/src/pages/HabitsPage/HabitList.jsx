import React, { useState } from "react"
import {
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Paper,
	Checkbox,
} from "@mui/material";
import InboxIcon from "@mui/icons-material/Inbox"
import { useMutation } from "@apollo/client"

import { CREATE_HABIT_HISTORY } from "./habitsQueries"
import { UPDATE_HABIT } from "./habitsQueries"
// import { DELETE_HABIT } from "./habitsQueries"


const HabitList = ({ refetch, habits }) => {
	const [showEditDialog, setShowEditDialog] = useState(false)

	// const [deleteHabit] = useMutation(DELETE_HABIT);
	const [createHabitHistory] = useMutation(CREATE_HABIT_HISTORY);
	const [updateHabit] = useMutation(UPDATE_HABIT);

	const handleUpdateHabit = (id, Title, Active, Frequency, LastCompleted) => {
		updateHabit({
			variables: {
				id: id,
				Title: Title,
				Active: Active,
				Frequency: Frequency
			},
		})
		setTimeout(() => {
			refetch()
		}, 500)
	}

	// const handleDelete = (id) => {
	// 	deleteHabit({
	// 		variables: {
	// 			id: id,
	// 		},
	// 	})
	// 	setTimeout(() => {
	// 		refetch()
	// 	}, 500)
	// }

	const handleHabitCompletion = (habitId) => {
		createHabitHistory({
			variables: {
				data: {
					Date: new Date().toISOString().split("T")[0],
					habit: habitId,
					Completed: true,
				},
			},
		})
		setTimeout(() => {
			refetch()
		}, 500)
	}

	const sortedHabits = () => {
		return [...habits].sort((a, b) => {
			const aIsCompleted = a.attributes.habit_histories.data.some(
				(history) => history.attributes.Completed
			)
			const bIsCompleted = b.attributes.habit_histories.data.some(
				(history) => history.attributes.Completed
			)

			return aIsCompleted && !bIsCompleted ? 1 : !aIsCompleted && bIsCompleted ? -1 : 0;
		})
	}


	return (
		<List>
			{sortedHabits().map((item) => {
				const isCompleted = item.attributes.habit_histories.data.some(
					(history) => history.attributes.Completed
				)

				return (
					<ListItem key={item.id} disablePadding>
						<Paper
							elevation={1}
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
								<ListItemText primary={item.attributes.Title} />
								<Checkbox
									edge="end"
									checked={isCompleted}
									onChange={() => handleHabitCompletion(item.id)}
									color="primary"
								/>
							</ListItemButton>
						</Paper>
					</ListItem>
				)
			})}
		</List>
	)
}

export default HabitList