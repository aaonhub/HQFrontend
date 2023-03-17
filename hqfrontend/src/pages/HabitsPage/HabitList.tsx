import React, { FC, useState } from "react";
import {
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	IconButton,
	Paper,
	Box,
	Typography,
	Checkbox,
} from "@mui/material";
import InboxIcon from "@mui/icons-material/Inbox";
import DeleteIcon from "@mui/icons-material/Delete";
import { ReactSortable } from "react-sortablejs";
import { useMutation } from "@apollo/client";

import { DELETE_HABIT, CREATE_HABIT_HISTORY } from "./habitsQueries";

interface ItemType {
	id: number;
	attributes: {
		Title: string;
		Active: boolean;
		Frequency: string;
		LastCompleted: string;
		Order: number;
		habit_histories: {
			data: {
				id: number;
				attributes: {
					Date: string;
					Completed: boolean;
				};
			}[];
		};
	};
}

interface HabitListProps {
	refetch: () => void;
	habits: ItemType[];
}


const HabitList: FC<HabitListProps> = ({ refetch, habits }) => {

	const [deleteHabit] = useMutation(DELETE_HABIT);
	const [createHabitHistory] = useMutation(CREATE_HABIT_HISTORY);

	const handleDelete = (id: number) => {
		deleteHabit({
			variables: {
				id: id,
			},
		});
		setTimeout(() => {
			refetch();
		}, 500);
	};

	const handleHabitCompletion = (habitId: number) => {
		createHabitHistory({
			variables: {
				data: {
					Date: new Date().toISOString().split("T")[0],
					habit: habitId,
					Completed: true,
				},
			},
		});
		setTimeout(() => {
			refetch();
		}, 500);
	};

	const sortedHabits = () => {
		return [...habits].sort((a, b) => {
			const aIsCompleted = a.attributes.habit_histories.data.some(
				(history) => history.attributes.Completed
			);
			const bIsCompleted = b.attributes.habit_histories.data.some(
				(history) => history.attributes.Completed
			);

			return aIsCompleted && !bIsCompleted ? 1 : !aIsCompleted && bIsCompleted ? -1 : 0;
		});
	};


	return (
		<List>
			{sortedHabits().map((item) => {
				const isCompleted = item.attributes.habit_histories.data.some(
					(history) => history.attributes.Completed
				);

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
								<IconButton onClick={() => handleDelete(item.id)}>
									<DeleteIcon />
								</IconButton>
							</ListItemButton>
						</Paper>
					</ListItem>
				);
			})}
		</List>
	);
};

export default HabitList;