import { Box, Button, Divider, Grid, Menu, MenuItem, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useQuery, useMutation } from '@apollo/client'
import YearDayTitles from '../../models/daytitles'

// Queries and Mutations
import { GET_DAY_TITLES_BY_YEAR } from '../../models/daytitles'
import { CREATE_DAY_TITLES } from '../../models/daytitles'
import { UPDATE_DAY_TITLES } from '../../models/daytitles'


const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

interface YearPlanningProps {
	setCurrentView: React.Dispatch<React.SetStateAction<string>>
}

function useDebounce(value: any, delay: number) {
	const [debouncedValue, setDebouncedValue] = useState(value);

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		return () => {
			clearTimeout(handler);
		};
	}, [value, delay]);

	return debouncedValue;
}

const YearPlanning = ({ setCurrentView }: YearPlanningProps) => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
	const [year, setYear] = useState<number>(new Date().getFullYear());
	const [showSelect, setShowSelect] = useState<boolean>(false)
	const [yearData, setYearData] = useState<YearDayTitles | null>(null);
	const [initialYearData, setInitialYearData] = useState<YearDayTitles | null>(null);

	const debouncedYear = useDebounce(year, 500);

	const { loading, error, data } = useQuery(GET_DAY_TITLES_BY_YEAR, {
		variables: { year: debouncedYear },
		onError: (error) => {
			console.log(error)
		}
	});



	const [createDayTitles] = useMutation(CREATE_DAY_TITLES, {
		onCompleted: (data) => {
			console.log("completed")
		},
		onError: (error) => {
			console.log(error)
		}
	})

	useEffect(() => {
		console.log("now")
		if (data && data.dayTitlesByYear) {
			setYearData(JSON.parse(data.dayTitlesByYear.titles))
			setInitialYearData(JSON.parse(data.dayTitlesByYear.titles));
		} else if (!loading && !error) {
			const currentYear = year
			const newYearData = new YearDayTitles(currentYear);
			setYearData(newYearData);

			console.log(newYearData)

			// Create new year data on the server
			createDayTitles({
				variables: {
					year: currentYear,
					titles: JSON.stringify(newYearData),  // assuming your server can parse this JSON string
				},
			});
		}
	}, [data, loading, error, createDayTitles]);

	const [updateDayTitles] = useMutation(UPDATE_DAY_TITLES, {
		onCompleted: (data) => {
			console.log(data)
		},
		onError: (error) => {
			console.log(error)
		}
	})

	const handleUpdateDayTitles = () => {
		if (yearData && JSON.stringify(yearData) !== JSON.stringify(initialYearData)) {  // Compare current data to initial data
			updateDayTitles({
				variables: {
					id: data.dayTitlesByYear.id,
					year: year,
					titles: JSON.stringify(yearData)
				},
				onCompleted: (data) => {
					setInitialYearData(yearData);
				}
			});
		}
	}


	useEffect(() => {
		if (data) {
			console.log(data)
		}
	}, [data])


	useEffect(() => {
		const currentDate = new Date();
		const currentDayElement = document.getElementById(`day-${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`);
		currentDayElement?.scrollIntoView();
	}, [data]);


	const handleTitleChange = (monthIndex: number, dayIndex: number, newTitle: string) => {
		if (yearData) {
			const updatedMonths = [...yearData.months];
			updatedMonths[monthIndex].titles[dayIndex].title = newTitle;
			const updatedYearData = new YearDayTitles(year, updatedMonths);
			setYearData(updatedYearData);
		}
	}





	// const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
	// 	setAnchorEl(event.currentTarget)
	// }

	const handleClose = () => {
		setAnchorEl(null)
	}

	const handleMenuItemClick = (value: string) => {
		setCurrentView(value)
		handleClose()
	}

	const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
		setYear(event.target.value as number)
		setShowSelect(false)
	}

	const decrementYear = () => {
		setYear(prevYear => prevYear - 1)
	}

	const incrementYear = () => {
		setYear(prevYear => prevYear + 1)
	}

	const years = Array.from({ length: new Date().getFullYear() - 1899 }, (_, i) => 1900 + i)  // generates years from 1900 to current year


	if (loading) return <p>Loading...</p>
	if (error) return <p>Error :(</p>

	return (
		<Grid container spacing={3}>
			<Grid item xs={12}>
				<Box display="flex" alignItems="center">

					{/* Planning Type */}
					<Button
						aria-controls="simple-menu"
						aria-haspopup="true"
						// onClick={handleClick}
						sx={{ textTransform: 'none' }}
					>
						<Typography variant="h5" component="h1">
							Year Planning
						</Typography>
					</Button>
					<Menu
						id="simple-menu"
						anchorEl={anchorEl}
						open={Boolean(anchorEl)}
						onClose={handleClose}
						MenuListProps={{
							sx: { color: 'white' },
						}}
					>
						<MenuItem onClick={() => handleMenuItemClick('day')}>Day Planning</MenuItem>
						<MenuItem onClick={() => handleMenuItemClick('week')}>Week Planning</MenuItem>
						<MenuItem onClick={() => handleMenuItemClick('year')}>Year Planning</MenuItem>
					</Menu>



					{/* Year Select */}
					<Box display="flex">
						<Button onClick={decrementYear}>
							<ArrowBackIcon />
						</Button>
						{showSelect ?
							<select value={year} onChange={handleChange}>
								{years.map((yearOption, index) => (
									<option key={index} value={yearOption}>
										{yearOption}
									</option>
								))}
							</select>
							:
							<Typography variant="h6" component="h2">
								{year}
							</Typography>
						}
						<Button onClick={incrementYear}>
							<ArrowForwardIcon />
						</Button>
					</Box>


				</Box>
			</Grid>

			{/* DIVIDER */}
			<Grid item xs={12}>
				<Divider />
			</Grid>

			<Box style={{ overflowX: 'auto', display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', paddingLeft: '1rem' }}>
				{yearData && yearData.months.map((month, monthIndex) => (
					<div style={{ margin: '0.5rem' }} key={month.month}>
						<h2 style={{ textAlign: 'center', fontSize: '1.2em', fontWeight: 'bold', paddingBottom: '.5em' }}>{monthNames[month.month - 1]}</h2>
						{month.titles.map((day, dayIndex) => {
							// Get the current day
							const currentDate = new Date();
							const currentDay = currentDate.getDate();
							const currentMonth = currentDate.getMonth() + 1; // JavaScript's getMonth() method starts at 0 for January

							// Determine whether it's a weekend
							// Determine whether it's a weekend
							const date = new Date(year, month.month - 1, day.day); // month in JavaScript Date is 0-indexed
							const isWeekend = date.getDay() === 0 || date.getDay() === 6; // getDay() returns 0 for Sunday and 6 for Saturday


							return (
								<Box
									key={`${month.month}-${day.day}`}
									id={`day-${year}-${month.month}-${day.day}`}  // Unique id for each day
									sx={{ display: 'flex', alignItems: 'center', gap: '0', maxHeight: '25px' }}
								>

									<label style={{ width: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{day.day}:</label>

									<input
										value={day.title}
										onChange={event => handleTitleChange(monthIndex, dayIndex, event.target.value)}
										onBlur={handleUpdateDayTitles}
										onKeyPress={(event) => {
											if (event.key === 'Enter') {
												handleUpdateDayTitles();
												event.preventDefault();  // Prevents form submission
											}
										}}
										style={{
											width: '200px',
											maxHeight: '23px',
											overflow: 'auto',
											backgroundColor:
												day.day === currentDay && month.month === currentMonth ? 'rgba(0, 255, 0, 0.3)' :  // Current day
													isWeekend ? 'black' :  // Weekend
														'none'  // Other days
										}}
									/>


								</Box>
							)
						})}
					</div>
				))}
			</Box>









		</Grid>
	)
}

export default YearPlanning
