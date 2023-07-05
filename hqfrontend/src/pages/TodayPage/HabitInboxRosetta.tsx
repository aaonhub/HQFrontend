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


	if (habits) {
		habits.forEach((habit) => {
			SimpleItemArray.push({
				id: habit.id + "h",
				completedToday: habit.completedToday,
				title: habit.title ?? '',
				type: 'habit',
				startTime: habit.timeOfDay ?? "",
				startDate: habit.startDate ?? "",
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
				startDate: inboxItem.startDate ?? undefined,
				description: inboxItem.description ?? undefined,
			});
		});
	}

	return SimpleItemArray;
}

export default HabitInboxRosetta;
