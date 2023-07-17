import { useState } from 'react';
import { Box, Button, Container, Divider } from '@mui/material';
import TemplateDialog from './DialogTemplate';
import { ReactSortable } from "react-sortablejs";


const Test = () => {
	const [currentView, setCurrentView] = useState<string>('dragtest');

	return (
		<Container>
			<Box>
				<Button onClick={() => setCurrentView('dragtest')}>Draggable Test</Button>
				<Button onClick={() => setCurrentView('dialog')}>Dialog Test</Button>
			</Box>

			<Divider
				sx={{
					marginTop: 2,
					marginBottom: 2,
				}}
			/>

			<Box>
				{currentView === 'dragtest' &&
					<DraggableTest />
				}

				{currentView === 'dialog' &&
					<DialogTest />
				}
			</Box>

		</Container>
	);
};

export default Test;








const DraggableTest = () => {
	const [state, setState] = useState([
		{ id: 1, name: "shrek" },
		{ id: 2, name: "fiona" },
	]);

	return (
		<ReactSortable list={state} setList={setState}>
			{state.map((item) => (
				<div key={item.id}>{item.name}</div>
			))}
		</ReactSortable>
	);
}















const DialogTest = () => {
	const [showTemplateDialog, setShowTemplateDialog] = useState<boolean>(false);

	return (
		<Box>
			<Button onClick={() => setShowTemplateDialog(true)}>Open</Button>

			{showTemplateDialog &&
				<TemplateDialog id="1" handleClose={() => setShowTemplateDialog(false)} />
			}
		</Box>
	);
}