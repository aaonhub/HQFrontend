import { Box, Button, Divider, Grid, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useQuery, useMutation } from '@apollo/client'
import YearDayTitles from '../../models/daytitles'
import { useGlobalContext } from '../App/GlobalContextProvider'

// Queries and Mutations
import { GET_DAY_TITLES_BY_YEAR } from '../../models/daytitles'
import { CREATE_DAY_TITLES } from '../../models/daytitles'
import { UPDATE_DAY_TITLES } from '../../models/daytitles'
import PlanSelectDropdown from './PlanSelectDropdown'


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
	const { setSnackbar } = useGlobalContext();

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



	const scrollContainerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		// Initialize the x position
		let startX = 0;
		// Initialize the scroll left position
		let startScrollLeft = 0;
		// Initialize a flag to check if we are dragging
		let isDragging = false;

		// Get the scroll container element
		const scrollContainerElement = scrollContainerRef.current;

		if (scrollContainerElement) {
			// Add the mousedown event listener
			scrollContainerElement.addEventListener('mousedown', (e: any) => {
				isDragging = true;
				// Record the initial x position when mouse is down
				startX = e.pageX - scrollContainerElement.offsetLeft;
				// Record the initial scroll left position when mouse is down
				startScrollLeft = scrollContainerElement.scrollLeft;
			});

			// Add the mouseleave event listener
			scrollContainerElement.addEventListener('mouseleave', () => {
				isDragging = false;
			});

			// Add the mouseup event listener
			scrollContainerElement.addEventListener('mouseup', () => {
				isDragging = false;
			});

			// Add the mousemove event listener
			scrollContainerElement.addEventListener('mousemove', (e: any) => {
				if (!isDragging) return;
				// Prevent the default behavior
				e.preventDefault();
				// Calculate the new x position when mouse is moving
				const x = e.pageX - scrollContainerElement.offsetLeft;
				// Calculate the walk distance (how far we have moved)
				const walk = (x - startX) * 1; // The multiplier can be adjusted for the speed of the scroll
				// Set the scroll left position
				scrollContainerElement.scrollLeft = startScrollLeft - walk;
			});
		}
	}, [yearData]);




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
	}, [data, loading, error, createDayTitles, year]);

	const [updateDayTitles] = useMutation(UPDATE_DAY_TITLES, {
		onCompleted: (data) => {
			setSnackbar({
				open: true,
				message: "Yearly plan updated",
				severity: "success"
			})
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
		const currentDate = new Date();
		const currentDayId = `day-${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;

		// Create a new observer
		const observer = new MutationObserver((mutations, observer) => {
			// Look through all mutations that just occured
			for (let mutation of mutations) {
				// If the addedNodes property has one or more nodes
				if (mutation.addedNodes.length) {
					const currentDayElement = document.getElementById(currentDayId);
					if (currentDayElement) {
						// Scroll the currentDayElement into view
						currentDayElement.scrollIntoView({ inline: 'start' });
						// Stop observing after scrolling into view
						observer.disconnect();
					}
				}
			}
		});

		// Start observing the scroll container with the configured parameters
		const scrollContainerElement = scrollContainerRef.current;
		if (scrollContainerElement) {
			observer.observe(scrollContainerElement, { childList: true, subtree: true });
		}

		// Clean up
		return () => observer.disconnect();
	}, [data]);





	const handleTitleChange = (monthIndex: number, dayIndex: number, newTitle: string) => {
		if (yearData) {
			const updatedMonths = [...yearData.months];
			updatedMonths[monthIndex].titles[dayIndex].title = newTitle;
			const updatedYearData = new YearDayTitles(year, updatedMonths);
			setYearData(updatedYearData);
		}
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

			{/* Planning Type */}
			<Grid item xs={12}>
				<Box display="flex" alignItems="center">


					{/* Plan Select Dropdown */}
					<PlanSelectDropdown setCurrentView={setCurrentView} />


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

			{/* Divider */}
			<Grid item xs={12}>
				<Divider />
			</Grid>

			{/* Year Planning */}
			<Grid item xs={12}>
				<div
					ref={scrollContainerRef}
					style={{
						overflowX: 'auto',
						display: 'flex',
						flexDirection: 'row',
						flexWrap: 'nowrap',
						paddingLeft: '1rem',
						scrollbarWidth: 'none', // For Firefox
					}}
				>
					{/* Hide scrollbar for Chrome, Safari and Opera */}
					<style>
						{`
			::-webkit-scrollbar {
				display: none;
			}
		`}
					</style>
					{yearData && yearData.months.map((month, monthIndex) => (
						<div style={{ margin: '0.5rem' }} key={month.month}>
							<h2 style={{ textAlign: 'center', fontSize: '1.2em', fontWeight: 'bold', paddingBottom: '.5em' }}>
								{monthNames[month.month - 1]}
							</h2>
							{month.titles.map((day, dayIndex) => {
								// Get the current day
								const currentDate = new Date();
								const currentDay = currentDate.getDate();
								const currentMonth = currentDate.getMonth() + 1; // JavaScript's getMonth() method starts at 0 for January

								// Determine whether it's a weekend
								const date = new Date(year, month.month - 1, day.day); // month in JavaScript Date is 0-indexed
								const isWeekend = date.getDay() === 0 || date.getDay() === 6; // getDay() returns 0 for Sunday and 6 for Saturday

								return (
									<Box
										key={`${month.month}-${day.day}`}
										id={`day-${year}-${month.month}-${day.day}`}  // Unique id for each day
										sx={{ display: 'flex', alignItems: 'center', gap: '0', maxHeight: '23px' }}
									>

										<label style={{ width: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
											{day.day}:
										</label>

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
												maxHeight: '21px',
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
				</div>
			</Grid>

			<Grid item xs={12} sx={{ paddingBottom: '50vh' }}>

			</Grid>



		</Grid>
	)
}

export default YearPlanning
