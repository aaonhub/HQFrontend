import React from 'react';
import './ListItem.css';

interface ListItemProps {
	item: any
	onDelete: any
	onEdit: any
}

const ListItem: React.FC<ListItemProps> = ({ item, onDelete, onEdit }) => {
	return (
		<div className="list-item">
			<div className="item-text" onClick={onEdit}>
				{item}
			</div>
			<div className="item-buttons">
				<button className="delete-button" onClick={onDelete}>
					Delete
				</button>
				<button className="edit-button" onClick={onEdit}>
					Edit
				</button>
			</div>
		</div>
	);
};

export default ListItem;
