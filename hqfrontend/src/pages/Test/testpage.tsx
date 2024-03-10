import { useState } from 'react';
import { Box, Button, Container, Divider, } from '@mui/material';

import ReactDNDTest from './TestFiles/ReactDNDTest';
import SortableList from './TestFiles/SortableList';
import DraggableTest from './TestFiles/DraggableTest';
import BingoBoard from './TestFiles/BingoBoard';
import ContextMenuDemo from './TestFiles/ContextMenuDemo';
import ProjectContextMenu from './TestFiles/ProjectContextMenu';


const Test = () => {
	const [currentView, setCurrentView] = useState<string>('reactdnd');

	return (
		<Container>
			<Box>
				<Button onClick={() => setCurrentView('reactdnd')}>React DND Test</Button>
				<Button onClick={() => setCurrentView('dragtest')}>Draggable Test</Button>
				<Button onClick={() => setCurrentView('sortable')}>Sortable Test</Button>
				<Button onClick={() => setCurrentView('bingo')}>Bingo Test</Button>
				<Button onClick={() => setCurrentView('contextmenu')}>Context Menu Test</Button>
				<Button onClick={() => setCurrentView('projectcontextmenu')}>Project Context Menu Test</Button>
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
				{currentView === 'bingo' && <BingoBoard />}
				{currentView === 'contextmenu' && <ContextMenuDemo />}
				{currentView === 'projectcontextmenu' && <ProjectContextMenu />}
			</Box>

		</Container>
	);
};

export default Test;















