import { Box, Button, Grid, Menu, MenuItem, Typography } from '@mui/material'
import React from 'react'


interface YearPlanningProps {
	setCurrentView: React.Dispatch<React.SetStateAction<string>>;
}

const WeekPlanning = ({ setCurrentView }: YearPlanningProps) => {
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
							Week Planning
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



			<Grid item xs={10} sx={{ border: "1px solid black" }}>
				<Typography variant="h6" component="h2">
					Stuff
				</Typography>
			</Grid>

		</Grid>
	)
}

export default WeekPlanning