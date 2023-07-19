import { useState } from 'react';
import { Box, Button, Container, Divider,  } from '@mui/material';

import ReactDNDTest from './TestFiles/ReactDNDTest';
import SortableList from './TestFiles/SortableList';
import DraggableTest from './TestFiles/DraggableTest';


const Test = () => {
	const [currentView, setCurrentView] = useState<string>('reactdnd');

	return (
		<Container>
			<Box>
				<Button onClick={() => setCurrentView('reactdnd')}>React DND Test</Button>
				<Button onClick={() => setCurrentView('dragtest')}>Draggable Test</Button>
				<Button onClick={() => setCurrentView('sortable')}>Sortable Test</Button>
			</Box>

			<Divider
				sx={{
					marginTop: 2,
					marginBottom: 2,
				}}
			/>

			<Box>
				{currentView === 'reactdnd' && <ReactDNDTest />}
				{currentView === 'sortable' && <SortableList />}
				{currentView === 'dragtest' && <DraggableTest />}
			</Box>

		</Container>
	);
};

export default Test;















