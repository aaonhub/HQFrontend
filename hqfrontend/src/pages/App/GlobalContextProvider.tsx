import React, { createContext, useContext, useState } from "react";

interface IGlobalContext {
	// Globals
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

	// Sidebar
	todayBadges: [number | boolean, number | boolean];
	setTodayBadges: (value: [number | boolean, number | boolean]) => void;
	dailyReviewBadges: [number | boolean, number | boolean];
	setDailyReviewBadges: (value: [number | boolean, number | boolean]) => void;
	logBadges: [number | boolean, number | boolean];
	setLogBadges: (value: [number | boolean, number | boolean]) => void;
	hiddenItems: any;
	setHiddenItems: (value: any) => void;

	// Projects
	projectOrder: {
		pinned: string[];
		unpinned: string[];
	};
	setProjectOrder: (value: {
		pinned: string[];
		unpinned: string[];
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
	// Globals
	const [loggedIn, setLoggedIn] = useState(false);
	const [globalProfile, setGlobalProfile] = useState<string>("");
	const [snackbar, setSnackbar] = useState({
		message: '',
		open: false,
		severity: "success" as "success" | "error" | "info" | "warning"
	})

	// Notifications
	const [dailyReviewBadges, setDailyReviewBadges] = useState<[number | boolean, number | boolean]>([false, false]);
	const [todayBadges, setTodayBadges] = useState<[number | boolean, number | boolean]>([false, false]);
	const [logBadges, setLogBadges] = useState<[number | boolean, number | boolean]>([false, false]);
	const [hiddenItems, setHiddenItems] = useState(localStorage.getItem('hiddenSidebarItems') ? JSON.parse(localStorage.getItem('hiddenSidebarItems') || '') : []);

	// Projects
	const [projectOrder, setProjectOrder] = useState({
		pinned: [] as string[],
		unpinned: [] as string[],
	});


	return (
		<GlobalContext.Provider value={{
			// Globals
			loggedIn,
			setLoggedIn,
			globalProfile,
			setGlobalProfile,
			snackbar,
			setSnackbar,

			// Sidebar
			todayBadges,
			setTodayBadges,
			dailyReviewBadges,
			setDailyReviewBadges,
			logBadges,
			setLogBadges,
			hiddenItems,
			setHiddenItems,

			// Projects
			projectOrder,
			setProjectOrder,

		}
		}>
			{children}
		</GlobalContext.Provider>
	);
};
