// import React from 'react';

// Models
import Habit from "../../models/habit"
import InboxItem from "../../models/inboxitem"
import SimpleItem from "../../models/simpleitem"


interface HabitInboxRosettaProps {
	habits: Habit[]
	inboxItems: InboxItem[]
}


const HabitInboxRosetta = ({ habits, inboxItems }: HabitInboxRosettaProps) => {
	const SimpleItemArray: SimpleItem[] = [];

	console.log("habits: ", habits);
	console.log("inboxItems: ", inboxItems);

	if (habits) {
		habits.forEach((habit) => {
			SimpleItemArray.push({
				completedToday: habit.completedToday,
				title: habit.title ?? '',
				type: 'habit',
				id: habit.id + "h",
				startTime: habit.timeOfDay ?? "",
			});
		});
	}

	if (inboxItems) {
		inboxItems.forEach((inboxItem) => {
			SimpleItemArray.push({
				id: inboxItem.id + "i",
				completedToday: inboxItem?.completed ?? false,
				title: inboxItem.title ?? '',
				type: 'inbox',
				startTime: inboxItem.startTime ? inboxItem.startTime : undefined,
				length: inboxItem.length ? inboxItem.length : undefined,
			});
		});
	}

	return SimpleItemArray;
}

export default HabitInboxRosetta;
