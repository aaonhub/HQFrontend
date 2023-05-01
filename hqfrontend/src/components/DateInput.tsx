import React from "react";
import TextField from "@mui/material/TextField";

interface DateInputProps {
	label: string;
	name: string;
	date: Date | null;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const formatDate = (date: Date | null) => {
	if (!date) return "";
	const yyyy = date.getFullYear();
	const mm = String(date.getMonth() + 1).padStart(2, "0");
	const dd = String(date.getDate()).padStart(2, "0");
	return `${yyyy}-${mm}-${dd}`;
};

const DateInput: React.FC<DateInputProps> = ({ label, name, date, onChange }) => {
	return (
		<TextField
			name={name}
			label={label}
			type="date"
			value={formatDate(date)}
			onChange={onChange}
			variant="outlined"
			InputLabelProps={{
				shrink: true,
			}}
		/>
	);
};

export default DateInput;
