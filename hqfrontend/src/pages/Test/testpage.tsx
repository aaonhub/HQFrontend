import { useState } from 'react';
import { Button, Container } from '@mui/material';
import TemplateDialog from './DialogTemplate';


const Test = () => {
	const [showTemplateDialog, setShowTemplateDialog] = useState<boolean>(false);



	return (
		<Container maxWidth="xl">
			<Button onClick={() => setShowTemplateDialog(true)}>Open</Button>

			{showTemplateDialog &&
				<TemplateDialog id="1" handleClose={() => setShowTemplateDialog(false)} />
			}
		</Container>
	);
};

export default Test;
