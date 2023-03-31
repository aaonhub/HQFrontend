// src/contexts/ThemeContext.tsx
import React, { createContext, useState } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material';

// import themes
import { lightTheme } from './themes';
import { darkTheme } from './themes';
import { pinkTheme } from './themes';


interface ThemeContextProps {
	toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextProps>({
	toggleTheme: () => { },
});

interface ThemeProviderProps {
	children: React.ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
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
