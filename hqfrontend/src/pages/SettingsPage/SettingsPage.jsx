// src/pages/UserSettings.tsx
import React, { useContext } from 'react';
import { ThemeContext } from './ThemeContext';
import { Button } from '@mui/material';

const UserSettings = () => {
	const { toggleTheme } = useContext(ThemeContext);

	return (
		<div>
			<h1>User Settings</h1>
			<Button variant="contained" onClick={toggleTheme}>
				Toggle Theme
			</Button>
		</div>
	);
};

export default UserSettings;
