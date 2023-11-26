
import { Button, Menu, MenuItem, Typography, useTheme } from '@mui/material'
import React, { useState } from 'react'


interface PlanSelectDropdownProps {
    setCurrentView: React.Dispatch<React.SetStateAction<string>>
}


const PlanSelectDropdown = ({ setCurrentView }: PlanSelectDropdownProps) => {
    const theme = useTheme()
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    const handleMenuItemClick = (value: string) => {
        setCurrentView(value)
        handleClose()
    }


    return (
        <>
            {/* Planning Type */}
            <Button
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={handleClick}
                sx={{ textTransform: 'none' }}
            >
                <Typography variant="h5" component="h1" sx={{ flexGrow: 1, color: theme.palette.text.primary }}>
                    Year Planning
                </Typography>
            </Button>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                MenuListProps={{
                    sx: { color: theme.palette.text.primary }
                }}
            >
                <MenuItem onClick={() => handleMenuItemClick('day')}>Day Planning</MenuItem>
                <MenuItem onClick={() => handleMenuItemClick('week')}>Week Planning</MenuItem>
                <MenuItem onClick={() => handleMenuItemClick('year')}>Year Planning</MenuItem>
            </Menu>
        </>
    )
}

export default PlanSelectDropdown



