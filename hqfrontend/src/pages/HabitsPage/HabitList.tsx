import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, IconButton } from "@mui/material";
import InboxIcon from '@mui/icons-material/Inbox';
import DeleteIcon from '@mui/icons-material/Delete';
import React, { FC } from "react";
import { ReactSortable } from "react-sortablejs";
import { useMutation } from "@apollo/client";

import { DELETE_HABIT } from "./habitsQueries";

interface ItemType {
	id: number;
	attributes: {
		Title: string;
	};
}

interface HabitListProps {
	habits: ItemType[];
	setHabits: React.Dispatch<React.SetStateAction<ItemType[]>>;
	refetch: () => void;
}

const HabitList: FC<HabitListProps> = ({ habits, setHabits, refetch }) => {
	const [deleteHabit] = useMutation(DELETE_HABIT);

	if (!Array.isArray(habits)) {
		return <div>No habits</div>;
	}

	const handleDelete = (id: number) => {
		deleteHabit({
			variables: {
				id: id,
			},
		});

		//wait a bit for the mutation to complete
		setTimeout(() => { refetch() }, 500);
	};

	return (
		<List>
			<ReactSortable list={habits.map(x => ({ ...x, chosen: true }))} setList={setHabits}>
				{habits.map((item) => (
					<ListItem key={item.id} disablePadding>
						<ListItemButton>
							<ListItemIcon>
								<InboxIcon />
							</ListItemIcon>
							<ListItemText primary={item.attributes.Title} />
							<IconButton onClick={() => handleDelete(item.id)}>
								<DeleteIcon />
							</IconButton>
						</ListItemButton>
					</ListItem>
				))}
			</ReactSortable>
		</List>
	);
};

export default HabitList;
