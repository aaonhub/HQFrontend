import React, { createContext, useState } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material';

// import themes
import { lightTheme, darkTheme, pinkTheme } from './themes';



interface ThemeProviderProps {
	children: React.ReactNode;
}

export const ThemeContext = createContext({
	currentTheme: 'dark',
	setTheme: (theme: string) => { },
});

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
	const [currentTheme, setCurrentTheme] = useState('dark');

	const setTheme = (theme: string) => {
		setCurrentTheme(theme);
	};

	const selectTheme = (theme: string) => {
		switch (theme) {
			case 'dark':
				return darkTheme;
			case 'pink':
				return pinkTheme;
			default:
				return lightTheme;
		}
	};

	return (
		<ThemeContext.Provider value={{ currentTheme, setTheme }}>
			<MuiThemeProvider theme={selectTheme(currentTheme)}>
				{children}
			</MuiThemeProvider>
		</ThemeContext.Provider>
	);
};

export default ThemeProvider;
