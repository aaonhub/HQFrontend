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
			main: "#c4c4c4", // Light Grey
		},
		secondary: {
			main: "#e0e0e0", // Light Grey
		},
		background: {
			paper: "#1f1f1f", // Dark Grey
			default: "#0a0a0a", // Almost Black
		},
		text: {
			primary: "#f5f5f5", // Off-White
			secondary: "#c4c4c4", // Light Grey
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
