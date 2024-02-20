import { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import { useGlobalContext } from './GlobalContextProvider';
import { DailyReviewBadge, LogBadge, TodayBadge } from './Badges';
import logo from '../../utils/logo.svg';
import { Box, Container } from '@mui/system';
import { ListItem, ListItemIcon, ListItemText, Badge, Link as MuiLink, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import React from 'react';
import { useTheme } from "@mui/material"


export default function Sidebar() {
	const { globalProfile, settings } = useGlobalContext();
	const location = useLocation();
	const [selected, setSelected] = useState('0');

	const theme = useTheme();


	const sidebarItems = [
		[
			{
				id: '0', title: 'Today', link: '/', notifications: TodayBadge(), icon: (
					<>
						<path d="M12 19C10.067 19 8.31704 18.2165 7.05029 16.9498L12 12V5C15.866 5 19 8.13401 19 12C19 15.866 15.866 19 12 19Z" />
						<path
							fillRule="evenodd"
							clipRule="evenodd"
							d="M23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12ZM21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
						/>
					</>
				)
			},
			{
				id: '3', title: 'Projects', link: '/projects', notifications: false, icon: (
					<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
						<g>
							<path d="M14 3a2 2 0 0 1 1.995 1.85L16 5v1.055l3.641.976a2 2 0 0 1 1.448 2.304l-.034.145l-2.588 9.66a2 2 0 0 1-2.304 1.447l-.145-.033l-.587-.157c-.322.33-.759.55-1.246.595L14 21H5a2 2 0 0 1-1.995-1.85L3 19V5a2 2 0 0 1 1.85-1.995L5 3h9Zm0 2H5v14h9V5Zm2 3.126v10.353l.535.143l2.589-9.66L16 8.127Z" />
						</g>
					</svg>
				)
			},
			{
				id: '1', title: 'Log', link: '/log', notifications: LogBadge(), icon: (
					<>
						<path
							fillRule="evenodd"
							clipRule="evenodd"
							d="M3 5C3 3.34315 4.34315 2 6 2H14C17.866 2 21 5.13401 21 9V19C21 20.6569 19.6569 22 18 22H6C4.34315 22 3 20.6569 3 19V5ZM13 4H6C5.44772 4 5 4.44772 5 5V19C5 19.5523 5.44772 20 6 20H18C18.5523 20 19 19.5523 19 19V9H13V4ZM18.584 7C17.9413 5.52906 16.6113 4.4271 15 4.10002V7H18.584Z"
						/>
					</>
				)
			},
			{
				id: '12', title: 'Plan', link: '/plan', notifications: false, icon: (
					<>
						<path d="M19 22H5C3.89543 22 3 21.1046 3 20V6C3 4.89543 3.89543 4 5 4H7V2H9V4H15V2H17V4H19C20.1046 4 21 4.89543 21 6V20C21 21.1046 20.1046 22 19 22ZM5 10V20H19V10H5ZM5 6V8H19V6H5ZM17 14H7V12H17V14Z" />
					</>
				)
			},
			{
				id: '2', title: 'Inbox', link: '/inbox', notifications: false, icon: (
					<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
						<path d="M5 21q-.825 0-1.413-.588T3 19V5q0-.825.588-1.413T5 3h14q.825 0 1.413.588T21 5v14q0 .825-.588 1.413T19 21H5Zm7-5q.95 0 1.725-.55T14.8 14H19V5H5v9h4.2q.3.9 1.075 1.45T12 16Z" />
					</svg>
				)
			},
			{
				id: '7', title: 'Maintenance', link: '/maintenance', notifications: false, icon: (
					<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
						<g stroke="#000000">
							<path d="M3 4v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8h-4" />
							<path d="M3 4h14v14a2 2 0 0 0 2 2v0M13 8H7m6 4H9" />
						</g>
					</svg>
				)
			},
			{
				id: '4', title: 'Habits', link: '/habits', notifications: false, icon: (
					<>
						<svg xmlns="http://www.w3.org/2000/svg" className="ionicon" viewBox="0 0 512 512"><ellipse cx="256" cy="256" rx="267.57" ry="173.44" transform="rotate(-45 256 256.002)" fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="32" /><ellipse cx="256" cy="256" rx="267.57" ry="173.44" transform="rotate(-45 256 256.002)" fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="32" /><ellipse cx="256" cy="256" rx="267.57" ry="173.44" transform="rotate(-45 256 256.002)" fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="32" /><ellipse cx="256" cy="256" rx="267.57" ry="173.44" transform="rotate(-45 256 256.002)" fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="32" /><ellipse cx="256" cy="256" rx="267.57" ry="173.44" transform="rotate(-45 256 256.002)" fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="32" /><ellipse cx="256" cy="256" rx="267.57" ry="173.44" transform="rotate(-45 256 256.002)" fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="32" /></svg>
					</>
				)
			},
			{
				id: '5', title: 'Rituals', link: '/rituals', notifications: false, icon: (
					<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
						<path d="M12.5 2c-1.66 0-3 3.34-3 5a3 3 0 0 0 3 3a3 3 0 0 0 3-3c0-1.66-1.34-5-3-5m0 4.5a1 1 0 0 1 1 1a1 1 0 0 1-1 1a1 1 0 0 1-1-1a1 1 0 0 1 1-1M10 11a1 1 0 0 0-1 1v8H7a1 1 0 0 1-1-1v-1a1 1 0 0 0-1-1a1 1 0 0 0-1 1v1a3 3 0 0 0 3 3h12a1 1 0 0 0 1-1a1 1 0 0 0-1-1h-3v-8a1 1 0 0 0-1-1h-5Z" />
					</svg>
				)
			},
			{
				id: '6', title: 'Reviews', link: '/dailyreview', notifications: DailyReviewBadge(), icon: (
					<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
						<g stroke="#000000">
							<path d="M3 4v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8h-4" />
							<path d="M3 4h14v14a2 2 0 0 0 2 2v0M13 8H7m6 4H9" />
						</g>
					</svg>
				)
			},
			{
				id: '8', title: 'Accountability', link: '/accountability', notifications: false, icon: (
					<>
						<svg xmlns="http://www.w3.org/2000/svg" className="ionicon" viewBox="0 0 512 512"><circle cx="256" cy="352" r="112" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" /><circle cx="256" cy="352" r="48" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" /><path d="M147 323L41.84 159.32a32 32 0 01-1.7-31.61l31-62A32 32 0 0199.78 48h312.44a32 32 0 0128.62 17.69l31 62a32 32 0 01-1.7 31.61L365 323M371 144H37M428.74 52.6L305 250M140.55 144L207 250" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" /></svg>
					</>
				)
			},
			{
				id: '11', title: 'To Dos', link: '/todos', notifications: false, icon: (
					<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
						<path d="m9 20.42l-6.21-6.21l2.83-2.83L9 14.77l9.88-9.89l2.83 2.83L9 20.42Z" />
					</svg>
				)
			},
		],
		[
			{ id: '9', title: 'Settings', link: '/settings', notifications: false },
			{ id: '10', title: 'Help', link: '/help', notifications: false },
		],
	];

	// Use effect to listen to location change
	useEffect(() => {
		// This will set the selected state based on current URL.
		const getCurrentSelected = () => {
			for (let group of sidebarItems) {
				for (let item of group) {
					if (item.link === location.pathname) {
						return item.id;
					}
				}
			}
		}
		setSelected(getCurrentSelected() || ''); // Provide a default value for setSelected
	}, [location]);


	return (
		// <Container sx={{
		// 	height: '100vh',
		// 	padding: 0,
		// 	display: 'flex', // Ensures the flex container to organize children
		// 	flexDirection: 'column', // Stack items vertically
		// 	backgroundColor: theme.palette.background.paper,
		// 	overflow: 'auto' // Adds scroll to Sidebar if content overflows
		// }}>
		<div
			style={{
				height: '100vh',
				padding: 0,
				display: 'flex', // Ensures the flex container to organize children
				flexDirection: 'column', // Stack items vertically
				backgroundColor: theme.palette.background.paper,
				overflow: 'auto' // Adds scroll to Sidebar if content overflows
			}}
		>

			<Box sx={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				p: 2, // Adjust padding as needed
			}}>
				<img src={logo} alt="My Logo" style={{ width: 40, height: 40 }} />
				<Typography variant="h6" sx={{ ml: 1 }}>HQ</Typography>
			</Box>


			<Box sx={{ flexGrow: 1 }}>
				{sidebarItems[0].map((item) => (
					<MenuItem
						key={item.id}
						item={item}
						onClick={setSelected}
						selected={selected}
					/>
				))}
			</Box>

			<Box>
				{sidebarItems[1].map((item) => (
					<MenuItem
						key={item.id}
						item={item}
						onClick={setSelected}
						selected={selected}
					/>
				))}
			</Box>



			{/* Profile Display at the bottom */}
			<Box sx={{
				padding: '16px', // Adjust the padding as needed
				borderTop: '1px solid', // Optional: adds a divider line
				borderColor: 'divider', // Use the theme's divider color
			}}>
				<Typography variant="body1">
					{globalProfile ? globalProfile.codename : "Log In"}
				</Typography>
				{/* Add more profile details or icons here */}
			</Box>


		</div>
		// </Container>
	);
}


type MenuItemProps = {
	item: {
		id: string;
		title: string;
		link: string;
		notifications: any;
		icon?: JSX.Element;
	};
	onClick: (id: string) => void;
	selected: string;
}

function MenuItem({ item: { id, title, link, notifications, icon }, onClick, selected }: MenuItemProps) {
	const theme = useTheme();
	console.log(notifications);

	return (
		<ListItem
			button
			component={Link}
			to={link}
			selected={selected === id}
			onClick={() => onClick(id)}
			style={{ color: theme.palette.text.primary }} // This line sets the text color, which 'currentColor' in SVG can refer to
			dense={true}
		>
			{
				icon &&
				<ListItemIcon style={{ minWidth: 'auto', marginRight: 8 }} color='primary'>
					<svg
						style={{ width: 24, height: 24, fill: 'currentColor' }} // 'currentColor' will use the color from the ListItem style
						viewBox="0 0 24 24"
					>
						{icon}
					</svg>
				</ListItemIcon>
			}
			<ListItemText primary={title} />
			{
				notifications[0] && (
					<Badge
						color="primary"
						badgeContent={notifications[0]}
					/>
				)
			}
			{
				notifications[1] && (
					<Badge
						color="secondary"
						badgeContent={notifications[1]}
					/>
				)
			}
		</ListItem >
	);
}
