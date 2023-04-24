import React, { useState } from 'react';

import ListItem from '../components/ListItem';


export default function Test() {
	const [items, setItems] = useState(['Item 1', 'Item 2', 'Item 3']);

	const handleDelete = (index: number) => {
		const newItems = [...items];
		newItems.splice(index, 1);
		setItems(newItems);
	};

	const handleEdit = (index: number) => {
		const newItem = prompt('Enter a new item:');
		if (newItem) {
			const newItems = [...items];
			newItems[index] = newItem;
			setItems(newItems);
		}
	};

	return (
		<div className="list">
			{items.map((item: string, index) => (
				<ListItem
					key={index}
					item={item}
					onDelete={() => handleDelete(index)}
					onEdit={() => handleEdit(index)}
				/>
			))}
		</div>
	);
};