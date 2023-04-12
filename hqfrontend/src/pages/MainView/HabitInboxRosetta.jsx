// import React from 'react';

function HabitInboxRosetta({ habits, inboxData }) {
	const habitInboxArray = []

	if (habits && habits.habits.data) {
		habits.habits.data.forEach((habit) => {
			const habitHistory = habit.attributes.habit_histories?.data[0];
			const completedToday = habitHistory?.attributes?.Completed ?? false;

			habitInboxArray.push({
				completedToday,
				title: habit.attributes?.Title ?? '',
				type: 'habit',
				id: habit.id,
				startTime: habit.attributes?.HabitFrequency?.TimeOfDay ?? '',
			});
		});
	}

	if (inboxData && inboxData.toDoItems) {
		inboxData.toDoItems.data.forEach((inboxItem) => {
			habitInboxArray.push({
				completedToday: inboxItem.attributes?.Completed ?? false,
				title: inboxItem.attributes?.Title ?? '',
				type: 'inbox',
				id: inboxItem.id,
				startTime: inboxItem.attributes?.StartTime ?? '',
			});
		});
	}

	return habitInboxArray;
}

export default HabitInboxRosetta;
