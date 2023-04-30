import React, { useRef, useState, useEffect } from 'react';
import Sortable from 'sortablejs';
import './Test.css';

interface ListItem {
	id: number;
	text: string;
}

export default function Test() {
	const [listItems, setListItems] = useState<ListItem[]>([
		{ id: 1, text: 'Item 1' },
		{ id: 2, text: 'Item 2' },
		{ id: 3, text: 'Item 3' },
		{ id: 4, text: 'Item 4' },
		{ id: 5, text: 'Item 5' },
	]);

	

	const listRef = useRef<HTMLUListElement>(null);

	const onSortEnd = (event: any) => {
		const { oldIndex, newIndex } = event;
		setListItems((items) => {
			const newItems = [...items];
			const [removed] = newItems.splice(oldIndex, 1);
			newItems.splice(newIndex, 0, removed);
			return newItems;
		});
	};

	React.useEffect(() => {
		if (listRef.current) {
			Sortable.create(listRef.current, {
				onEnd: onSortEnd,
				handle: '.drag-handle',
				draggable: '.sortable-item',
				onStart: (event: any) => {
					event.item.querySelector('.drag-handle').style.cursor = 'grabbing';
				},
			});
		}
	}, []);

	return (
		<ul className="sortable-list" ref={listRef}>
			{listItems.map((item) => (
				<li key={item.id} className="sortable-item">
					<span className="drag-handle">&#x2630;</span>
					{item.text}
				</li>
			))}
		</ul>
	);
};