import { createTheme } from "@mui/material/styles";

export const lightTheme = createTheme({
	palette: {
		mode: "light",
		primary: {
			main: "#1976d2",
		},
		secondary: {
			main: "#dc004e",
		},
	},
});

export const darkTheme = createTheme({
	palette: {
		mode: "dark",
		primary: {
			main: "#90caf9",
		},
		secondary: {
			main: "#f48fb1",
		},
	},
});

export const pinkTheme = createTheme({
	palette: {
		mode: "light",
		primary: {
			main: "#e91e63",
		},
		secondary: {
			main: "#ff80ab",
		},
		background: {
			default: "#fce4ec",
			paper: "#f8bbd0",
		},
		text: {
			primary: "#880e4f",
			secondary: "#ad1457",
		},
	},
});
