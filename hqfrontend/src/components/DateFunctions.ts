
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

export function dateToYYYYMMDD(date: Date | null) {
	if (!date) {
		return "";
	}
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
}

export function yyyymmddToDate(yyyymmdd: string) {
	const [year, month, day] = yyyymmdd.split('-').map(Number);
	const date = new Date(year, month - 1, day);
	return date;
}

export function dateTo24hTime(date: Date) {
	const hours = String(date.getHours()).padStart(2, '0');
	const minutes = String(date.getMinutes()).padStart(2, '0');
	const seconds = String(date.getSeconds()).padStart(2, '0');
	return `${hours}:${minutes}:${seconds}`;
}