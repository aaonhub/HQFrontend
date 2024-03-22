
export function getCurrentLocalDate() {
	const now = new Date();
	if (now.getHours() < 6) {
		now.setDate(now.getDate() - 1);
	}
	const year = now.getFullYear();
	const month = String(now.getMonth() + 1).padStart(2, '0');
	const day = String(now.getDate()).padStart(2, '0');

	return `${year}-${month}-${day}`;
}


export function getCurrentLocalDateUnadjusted() {
	const now = new Date();
	const year = now.getFullYear();
	const month = String(now.getMonth() + 1).padStart(2, '0');
	const day = String(now.getDate()).padStart(2, '0');

	return `${year}-${month}-${day}`;
}

export function currentLocalTime() {
	const now = new Date();
	const hours = String(now.getHours()).padStart(2, '0');
	const minutes = String(now.getMinutes()).padStart(2, '0');
	const seconds = String(now.getSeconds()).padStart(2, '0');
	return `${hours}:${minutes}:${seconds}`;
}

// Length is in "hh:mm" format
// startTime is in "hh:mm:ss" format
export function addLengthToTime(startTime: string, length: string): string {
	const [startHour, startMinute, startSecond] = startTime.split(':').map(Number);
	const [lengthHour, lengthMinute] = length.split(':').map(Number);

	const date = new Date();
	date.setHours(startHour, startMinute, startSecond);

	// Create a new date for the length, we will use this just to extract the time duration
	const lengthDate = new Date();
	lengthDate.setHours(lengthHour, lengthMinute, 0); // Assuming length is always in "hh:mm" format

	date.setSeconds(date.getSeconds() + lengthDate.getHours() * 3600 + lengthDate.getMinutes() * 60);

	const hours = date.getHours().toString();
	const minutes = date.getMinutes().toString();
	const seconds = date.getSeconds().toString();

	// If the hours, minutes or seconds are single digit, prepend with '0'
	const formattedHours = hours.length < 2 ? '0' + hours : hours;
	const formattedMinutes = minutes.length < 2 ? '0' + minutes : minutes;
	const formattedSeconds = seconds.length < 2 ? '0' + seconds : seconds;

	return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
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
export function getCustomLocalDate(date: Date = new Date()) {
	let currentDate = new Date(date);
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

