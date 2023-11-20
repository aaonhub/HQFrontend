import React from 'react';
import { useTheme } from '@mui/material';

interface MonthInputsProps {
    month: any; // Replace 'any' with the actual type for your month data
    monthIndex: number;
    handleTitleChange: (monthIndex: number, dayIndex: number, newValue: string) => void;
    handleUpdateDayTitles: () => void;
    currentDay: number;
    currentMonth: number;
    year: number;
}

const MonthInputs: React.FC<MonthInputsProps> = ({
    month,
    monthIndex,
    handleTitleChange,
    handleUpdateDayTitles,
    currentDay,
    currentMonth,
    year
}) => {
    const theme = useTheme();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    return (
        <div style={{ margin: '0.5rem' }}>
            <h2 style={{ textAlign: 'center', fontSize: '1.2em', fontWeight: 'bold', paddingBottom: '.5em' }}>
                {monthNames[month.month - 1]}
            </h2>
            {month.titles.map((day: any, dayIndex: number) => {
                const isWeekend = new Date(year, month.month - 1, day.day).getDay() === 0 ||
                    new Date(year, month.month - 1, day.day).getDay() === 6;
                const backgroundColor = day.day === currentDay && month.month === currentMonth
                    ? theme.palette.primary.main
                    : isWeekend
                        ? theme.palette.secondary.main
                        : theme.palette.background.default;

                return (
                    <div key={`${month.month}-${day.day}`} id={`day-${year}-${month.month}-${day.day}`}
                        style={{ display: 'flex', alignItems: 'center', gap: '0', maxHeight: '23px' }}>
                        <label style={{ width: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {day.day}:
                        </label>
                        <input
                            type="text"
                            value={day.title}
                            onChange={(e) => handleTitleChange(monthIndex, dayIndex, e.target.value)}
                            onBlur={handleUpdateDayTitles}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    handleUpdateDayTitles();
                                    e.preventDefault();
                                }
                            }}
                            style={{
                                width: '200px',
                                maxHeight: '21px',
                                overflow: 'auto',
                                backgroundColor: backgroundColor,
                                border: `1px solid ${theme.palette.grey[400]}`, // Border color from theme
                                padding: theme.spacing(1), // Padding from theme
                            }}
                        />
                    </div>
                );
            })}
        </div>
    );
};

export default MonthInputs;
