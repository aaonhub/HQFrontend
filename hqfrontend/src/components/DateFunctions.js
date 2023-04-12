export function getCurrentLocalDate() {
	const now = new Date();
	const year = now.getFullYear();
	const month = String(now.getMonth() + 1).padStart(2, '0');
	const day = String(now.getDate()).padStart(2, '0');

	return `${year}-${month}-${day}`;
}

export function getCurrentDayOfWeek() {
	const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	const now = new Date();
	const dayOfWeekIndex = now.getDay();
	return daysOfWeek[dayOfWeekIndex];
}

export function getCurrentDayOfMonth() {
	const now = new Date();
	return now.getDate();
}