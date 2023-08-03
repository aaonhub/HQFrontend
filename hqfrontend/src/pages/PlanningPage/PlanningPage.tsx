import React, { useEffect } from 'react';
import DayPlanning from './DayPlanning';
import WeekPlanning from './WeekPlanning';
import YearPlanning from './YearPlanning';
import { AnimatePresence, motion } from 'framer-motion';

const PlanningPage = () => {
	useEffect(() => {
		document.title = 'Planning - HQ';
	}, []);

	const [currentView, setCurrentView] = React.useState("year");

	const pageVariants = {
		initial: {
			opacity: 0,
		},
		in: {
			opacity: 1,
		},
		out: {
			opacity: 0,
		}
	};

	const pageTransition = {
		type: "tween",
		ease: "easeOut",
		duration: 0.1
	};

	return (
		<AnimatePresence mode='wait'>
			{currentView === "day" && (
				<motion.div
					key="day"
					initial="initial"
					animate="in"
					exit="out"
					variants={pageVariants}
					transition={pageTransition}
				>
					<DayPlanning setCurrentView={setCurrentView} />
				</motion.div>
			)}
			{currentView === "week" && (
				<motion.div
					key="week"
					initial="initial"
					animate="in"
					exit="out"
					variants={pageVariants}
					transition={pageTransition}
				>
					<WeekPlanning setCurrentView={setCurrentView} />
				</motion.div>
			)}
			{currentView === "year" && (
				<motion.div
					key="year"
					initial="initial"
					animate="in"
					exit="out"
					variants={pageVariants}
					transition={pageTransition}
				>
					<YearPlanning setCurrentView={setCurrentView} />
				</motion.div>
			)}
		</AnimatePresence>
	);
}

export default PlanningPage;
