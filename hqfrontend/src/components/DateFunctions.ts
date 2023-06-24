
export function getCurrentLocalDate() {
	const now = new Date();
	if (now.getHours() < 3) {
		now.setDate(now.getDate() - 1);
	}
	const year = now.getFullYear();
	const month = String(now.getMonth() + 1).padStart(2, '0');
	const day = String(now.getDate()).padStart(2, '0');

	return `${year}-${month}-${day}`;
}

function getOrdinalSuffix(i: number) {
	const j = i % 10;
	const k = i % 100;
	if (j === 1 && k !== 11) {
		return i + "st";
	}
	if (j === 2 && k !== 12) {
		return i + "nd";
	}
	if (j === 3 && k !== 13) {
		return i + "rd";
	}
	return i + "th";
}
export function getCustomLocalDate() {
	let currentDate = new Date();
	if (currentDate.getHours() < 3) {
		currentDate.setDate(currentDate.getDate() - 1);
	}

	const dayWithSuffix = getOrdinalSuffix(currentDate.getDate());
	const month = currentDate.toLocaleString(undefined, { month: 'long' });
	const year = currentDate.getFullYear();
	const weekday = currentDate.toLocaleString(undefined, { weekday: 'long' });

	const customFormattedDate = `${weekday}, ${month} ${dayWithSuffix}, ${year}`;

	return customFormattedDate;
}

export function convertDateToLocal(date: Date) {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');

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


// Conversion functions
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

export function formatDateWithWeekday(dateString: string) {
	const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	const [year, month, day] = dateString.split('-').map(Number);
	const date = new Date(year, month - 1, day);
	const dayOfWeekIndex = date.getDay();
	const dayOfWeek = daysOfWeek[dayOfWeekIndex];
	const formattedMonth = String(month).padStart(2, '0');
	const formattedDay = String(day).padStart(2, '0');

	return `${dayOfWeek}, ${formattedMonth}/${formattedDay}/${year}`;
}

