import React from 'react'
import DayPlanning from './DayPlanning'
import WeekPlanning from './WeekPlanning'
import YearPlanning from './YearPlanning'


const PlanningPage = () => {
	const [currentView, setCurrentView] = React.useState("year")


	return (
		<>

			{currentView === "day" && <DayPlanning setCurrentView={setCurrentView} />}
			{currentView === "week" && <WeekPlanning setCurrentView={setCurrentView} />}
			{currentView === "year" && <YearPlanning setCurrentView={setCurrentView} />}

		</>
	)
}

export default PlanningPage