import React, { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { List, ListItem, ListItemButton, ListItemText, Paper } from "@mui/material";

const initialItems = ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"];

function SimpleDraggableList() {
	const [items, setItems] = useState(initialItems);

	const onDragEnd = (result: any) => {
		if (!result.destination) return;

		const newArr = Array.from(items);
		const [reorderedItem] = newArr.splice(result.source.index, 1);
		newArr.splice(result.destination.index, 0, reorderedItem);

		setItems(newArr);
	};

	return (
		<Paper>
			<DragDropContext onDragEnd={onDragEnd}>
				<Droppable droppableId="droppable">
					{(provided) => (
						<List {...provided.droppableProps} ref={provided.innerRef}>
							{items.map((item, index) => (
								<Draggable key={item} draggableId={item} index={index}>
									{(provided) => (
										<ListItem
											ref={provided.innerRef}
											{...provided.draggableProps}
											{...provided.dragHandleProps}
										>
											<ListItemButton>
												<ListItemText primary={item} />
											</ListItemButton>
										</ListItem>
									)}
								</Draggable>
							))}
							{provided.placeholder}
						</List>
					)}
				</Droppable>
			</DragDropContext>
		</Paper>
	);
}

export default SimpleDraggableList;
