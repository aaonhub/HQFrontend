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
		error: {
			main: "#f44336",
		},
		warning: {
			main: "#ff9800",
		},
		info: {
			main: "#2196f3",
		},
		success: {
			main: "#4caf50",
		},
	},
});


export const darkTheme = createTheme({
	palette: {
		mode: "dark",
		primary: {
			main: "#1c1c1c", // Slightly darker shade for primary
		},
		secondary: {
			main: "#424242", // Darker shade for secondary
		},
		background: {
			paper: "#121212", // Deeper shade for paper backgrounds
			default: "#000000", // True black for default background
		},
		text: {
			primary: "#eaeaea", // Slightly dimmed white for primary text
			secondary: "#a3a3a3", // Darker shade for secondary text
		},
		error: {
			main: "#b71c1c", // Darker shade for error
		},
		warning: {
			main: "#f57c00", // Slightly deeper shade for warning
		},
		info: {
			main: "#1976d2", // Darker shade for info
		},
		success: {
			main: "#388e3c", // Darker shade for success
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
		error: {
			main: "#f44336",
		},
		warning: {
			main: "#ff9800",
		},
		info: {
			main: "#2196f3",
		},
		success: {
			main: "#4caf50",
		},
	},
});


export const christmasTheme = createTheme({
	palette: {
		mode: "dark",
		primary: {
			main: "#0d5c2d", // Christmas green
		},
		secondary: {
			main: "#b22222", // Christmas red
		},
		background: {
			paper: "#1c1c1c", // Dark background for paper elements
			default: "#121212", // Darker background for default
		},
		text: {
			primary: "#f5f5f5", // Bright text for contrast
			secondary: "#c4c4c4", // Slightly dimmed for secondary text
		},
		error: {
			main: "#ff6f60", // A lighter red for error messages
		},
		warning: {
			main: "#ffeb3b", // Gold color for warnings
		},
		info: {
			main: "#2196f3", // Blue for info
		},
		success: {
			main: "#2e7d32", // Deeper green for success
		},
	},
});
