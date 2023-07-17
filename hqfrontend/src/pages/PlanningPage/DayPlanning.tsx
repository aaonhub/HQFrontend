import { Box, Button, Grid, Menu, MenuItem, Typography } from '@mui/material';
import React from 'react';


interface DayPlanningProps {
	setCurrentView: React.Dispatch<React.SetStateAction<string>>;
}

const DayPlanning = ({ setCurrentView }: DayPlanningProps) => {
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleMenuItemClick = (value: string) => {
		setCurrentView(value);
		handleClose();
	};

	return (
		<Grid container spacing={3}>

			<Grid item xs={12}>
				<Box>

					<Button
						aria-controls="simple-menu"
						aria-haspopup="true"
						onClick={handleClick}
						sx={{ textTransform: 'none' }}
					>
						<Typography variant="h5" component="h1">
							Day Planning
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

					<Typography variant="h6" component="h2">
						{new Date().toDateString()}
					</Typography>

				</Box>
			</Grid>


			{/* Calendar Section */}
			<Grid item xs={4} sx={{ border: "1px solid black" }}>

				<Grid container spacing={3}>

					<Grid item xs={6} sx={{ border: "1px solid black" }}>
						<Box sx={{ p: 3 }}>
							<Typography variant="h5" component="h1">
								Calendar 2
							</Typography>
						</Box>
					</Grid>

					<Grid item xs={6} sx={{ border: "1px solid black" }}>
						<Box sx={{ p: 3 }}>
							<Typography variant="h5" component="h1">
								Calendar 1
							</Typography>
						</Box>
					</Grid>

				</Grid>

			</Grid>

			{/* Itinirary */}
			<Grid item xs={3} sx={{ border: "1px solid black" }}>
				<Box sx={{ p: 3 }}>
					<Typography variant="h5" component="h1">
						Itinirary
					</Typography>
				</Box>
			</Grid>

			{/* To Do Lists */}
			<Grid item xs={5} sx={{ border: "1px solid black" }}>
				<Box sx={{ p: 3 }}>
					<Typography variant="h5" component="h1">
						To Do Lists
					</Typography>
					<ul>
						<li>Project</li>
						<li>To Do List</li>
					</ul>
				</Box>
			</Grid>

		</Grid>
	)
}

export default DayPlanning