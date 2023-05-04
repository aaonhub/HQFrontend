import React, { useContext } from 'react';
import { ThemeContext } from './ThemeContext';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

// Queries and Mutations
// import { GET_SETTINGS } from '../../models/settings';


const SettingsPage = () => {
	const { currentTheme, setTheme } = useContext(ThemeContext);

	const handleChange = (event: any) => {
		setTheme(event.target.value);
	};

	return (
		<div>
			<h1>Settings Page</h1>
			<FormControl variant="outlined" fullWidth>
				<InputLabel>Theme</InputLabel>
				<Select
					value={currentTheme}
					onChange={handleChange}
					label="Theme"
				>
					<MenuItem value="light">Light</MenuItem>
					<MenuItem value="dark">Dark</MenuItem>
					<MenuItem value="pink">Pink</MenuItem>
				</Select>
			</FormControl>
		</div>
	);
};

export default SettingsPage;
