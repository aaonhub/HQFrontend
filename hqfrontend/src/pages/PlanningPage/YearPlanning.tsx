import { Box, Button, Divider, Grid, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useQuery, useMutation } from '@apollo/client'
import YearDayTitles from '../../models/daytitles'
import { useGlobalContext } from '../App/GlobalContextProvider'
import { useDraggable } from 'react-use-draggable-scroll';

// Queries and Mutations
import { GET_DAY_TITLES_BY_YEAR } from '../../models/daytitles'
import { CREATE_DAY_TITLES } from '../../models/daytitles'
import { UPDATE_DAY_TITLES } from '../../models/daytitles'
import PlanSelectDropdown from './PlanSelectDropdown'
import MonthInputs from './MonthIput'



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




	// Drag Scroll Stuff
	const ref =
		useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>;
	const { events } = useDraggable(ref, {
		isMounted: false,
		applyRubberBandEffect: true,
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

	const currentDate = new Date();
	const currentDay = currentDate.getDate();
	const currentMonth = currentDate.getMonth() + 1;



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
						<Button color="secondary" onClick={decrementYear}>
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
						<Button color="secondary" onClick={incrementYear}>
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
					ref={ref}
					{...events}
					style={{
						overflowX: 'auto',
						display: 'flex',
						flexDirection: 'row',
						flexWrap: 'nowrap',
						paddingLeft: '1rem',
						scrollbarWidth: 'none', // For Firefox
					}}
				>
					{yearData && yearData.months.map((month, monthIndex) => (
						<MonthInputs
							key={month.month}
							month={month}
							monthIndex={monthIndex}
							handleTitleChange={handleTitleChange}
							handleUpdateDayTitles={handleUpdateDayTitles}
							currentDay={currentDay}
							currentMonth={currentMonth} year={0} />
					))}
				</div>
			</Grid>

		</Grid>
	)
}

export default YearPlanning
