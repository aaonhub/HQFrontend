import React, { useState } from 'react';
import EditToDoItemDialog from './EditToDoItemDialog';
import ToDoList from './ToDoList';

interface Props {
	// add any props here
}

export interface ToDoItem {
	id: string;
	attributes: {
		Title: string;
		Completed: boolean;
		DueDate: string;
		Description: string;
	};
}

const InboxPage: React.FC<Props> = (props: Props) => {
	const [showEditDialog, setShowEditDialog] = useState<boolean>(false);
	const [toDoItem, setToDoItem] = useState<ToDoItem>({
		id: '',
		attributes: {
			Title: '',
			Completed: false,
			DueDate: '',
			Description: ''
		}
	});


	return (
		<div>
			<ToDoList
				setShowEditDialog={setShowEditDialog}
				setToDoItem={setToDoItem}
			/>
			<EditToDoItemDialog
				showEditDialog={showEditDialog}
				setShowEditDialog={setShowEditDialog}
				toDoItem={toDoItem}
				setToDoItem={setToDoItem}
			/>
		</div>
	);
};

export default InboxPage;
