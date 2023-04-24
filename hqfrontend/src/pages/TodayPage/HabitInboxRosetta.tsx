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
				completedToday: habit.completedToday,
				title: habit.title ?? '',
				type: 'habit',
				id: habit.id ?? '',
				startTime: habit.habitFrequency?.timeOfDay ?? '',
			});
		});
	}

	if (inboxItems) {
		inboxItems.forEach((inboxItem) => {
			SimpleItemArray.push({
				completedToday: inboxItem?.completed ?? false,
				title: inboxItem.title ?? '',
				type: 'inbox',
				id: inboxItem.id,
				startTime: inboxItem.startTime ?? '',
			});
		});
	}

	return SimpleItemArray;
}

export default HabitInboxRosetta;
