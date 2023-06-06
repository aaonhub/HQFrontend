import React, { createContext, useContext, useState } from "react";

interface IGlobalContext {
	loggedIn: boolean;
	setLoggedIn: (value: boolean) => void;
	globalProfile: any;
	setGlobalProfile: (value: any) => void;
	snackbar: {
		message: string;
		open: boolean;
		severity: "success" | "error" | "info" | "warning";
	};
	setSnackbar: (snackbar: {
		message: string;
		open: boolean;
		severity: "success" | "error" | "info" | "warning";
	}) => void;
}

export const GlobalContext = createContext<IGlobalContext | null>(null);

export const useGlobalContext = () => {
	const context = useContext(GlobalContext);
	if (!context) {
		throw new Error("useGlobalContext must be used within a GlobalContextProvider");
	}
	return context;
};

export const GlobalContextProvider = ({ children }: { children: React.ReactNode }) => {
	const [loggedIn, setLoggedIn] = useState(false);
	const [globalProfile, setGlobalProfile] = useState<string>("");
	const [snackbar, setSnackbar] = useState({
		message: '',
		open: false,
		severity: "success" as "success" | "error" | "info" | "warning"
	})

	return (
		<GlobalContext.Provider value={{
			loggedIn,
			setLoggedIn,
			globalProfile,
			setGlobalProfile,
			snackbar,
			setSnackbar
		}
		}>
			{children}
		</GlobalContext.Provider>
	);
};
