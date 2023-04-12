// src/contexts/ThemeContext.tsx
import React, { createContext, useState } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material';

// import themes
import { lightTheme } from './themes';
import { darkTheme } from './themes';
// import { pinkTheme } from './themes';



export const ThemeContext = createContext({
	toggleTheme: () => { },
});


const ThemeProvider = ({ children }) => {
	const [isDarkMode, setIsDarkMode] = useState(false);

	const toggleTheme = () => {
		setIsDarkMode(!isDarkMode);
	};

	return (
		<ThemeContext.Provider value={{ toggleTheme }}>
			<MuiThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
				{children}
			</MuiThemeProvider>
		</ThemeContext.Provider>
	);
};

export default ThemeProvider;
