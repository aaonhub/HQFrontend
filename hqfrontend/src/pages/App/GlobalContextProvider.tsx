import React, { createContext, useContext, useState } from "react";
import SettingsObject from "../../models/settings";


interface DebugTextItem {
	title: string;
	content: any;
}

const defaultSettings: SettingsObject = {
	habitOrder: "[]",
	hiddenSidebarItems: [],
	id: "2",
	itineraryOrder: "",
	owner: {
		__typename: '',
		id: '',
		username: '',
		email: ''
	},
	projectOrder: "[]",
	masterListOrder: [],
	stickyNote: "",

	theme: "LIGHT",
	__typename: "SettingsType"
};

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
	debugPanelVisible: boolean;
	setDebugPanelVisible: (value: boolean) => void;
	debugText: DebugTextItem[];
	setDebugText: (value: DebugTextItem[]) => void;
	settings: any;
	setSettings: (value: any) => void;

	// Sidebar
	todayBadges: [number | boolean, number | boolean];
	setTodayBadges: (value: [number | boolean, number | boolean]) => void;
	dailyReviewBadges: [number | boolean, number | boolean];
	setDailyReviewBadges: (value: [number | boolean, number | boolean]) => void;
	logBadges: [number | boolean, number | boolean];
	setLogBadges: (value: [number | boolean, number | boolean]) => void;

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
	const [debugPanelVisible, setDebugPanelVisible] = useState(false);
	const [debugText, setDebugText] = useState<DebugTextItem[]>([]);
	const [settings, setSettings] = useState<SettingsObject>(() => {
		const savedSettings = localStorage.getItem('settings');
		return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
	});

	// Notifications
	const [dailyReviewBadges, setDailyReviewBadges] = useState<[number | boolean, number | boolean]>([false, false]);
	const [todayBadges, setTodayBadges] = useState<[number | boolean, number | boolean]>([false, false]);
	const [logBadges, setLogBadges] = useState<[number | boolean, number | boolean]>([false, false]);



	return (
		<GlobalContext.Provider value={{
			// Globals
			loggedIn,
			setLoggedIn,
			globalProfile,
			setGlobalProfile,
			snackbar,
			setSnackbar,
			debugPanelVisible,
			setDebugPanelVisible,
			debugText,
			setDebugText,
			settings,
			setSettings,

			// Sidebar
			todayBadges,
			setTodayBadges,
			dailyReviewBadges,
			setDailyReviewBadges,
			logBadges,
			setLogBadges

		}
		}>
			{children}
		</GlobalContext.Provider>
	);
};
