import { useState, useEffect } from 'react';
import clsx from "clsx"
import './Sidebar.css'
import { Link } from 'react-router-dom'
import { useLocation } from "react-router-dom";
import { useGlobalContext } from './GlobalContextProvider';
import { DailyReviewBadge, LogBadge, TodayBadge } from './Badges';
import { Badge } from '@mui/material';
import logo from '../../utils/logo.svg'


// Sidebar
export default function Sidebar() {
	const { globalProfile, settings } = useGlobalContext();
	const location = useLocation();
	const [selected, setSelected] = useState('0');


	const sidebarItems = [
		[
			{ id: '0', title: 'Today', link: '/', notifications: TodayBadge() },
			{ id: '3', title: 'Projects', link: '/projects', notifications: false },
			{ id: '1', title: 'Log', link: '/log', notifications: LogBadge() },
			{ id: '12', title: 'Plan', link: '/plan', notifications: false },
			{ id: '2', title: 'Inbox', link: '/inbox', notifications: false },
			{ id: '7', title: 'Maintenance', link: '/maintenance', notifications: false },
		],
		[
			{ id: '4', title: 'Habits', link: '/habits', notifications: false },
			{ id: '5', title: 'Rituals', link: '/rituals', notifications: false },
			{ id: '6', title: 'Reviews', link: '/dailyreview', notifications: DailyReviewBadge() },
			{ id: '8', title: 'Accountability', link: '/accountability', notifications: false },
			{ id: '11', title: 'To Dos', link: '/todos', notifications: false },
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
		setSelected(getCurrentSelected());
	}, [location]);


	return (
		<div
			className={clsx(
				'fixed inset-y-0 left-0 bg-card md:w-20 xl:w-60 sm:flex flex-col z-10',
			)}
		>

			{/* React Logo */}
			<div className="flex-shrink-0 overflow-hidden p-2">
				<div className="flex items-center h-full sm:justify-center xl:justify-start p-2 sidebar-separator-top">
					<img src={logo} alt="My Logo" className="w-10 h-10" />
					<div className="block sm:hidden xl:block ml-2 font-bold text-xl text-white">
						HQ
					</div>
					<div className="flex-grow sm:hidden xl:block" />
					<IconButton
						icon="res-react-dash-sidebar-close"
						className="block sm:hidden"
					/>
				</div>
			</div>


			<div className="flex-grow overflow-x-hidden overflow-y-auto flex flex-col">


				{/* Sidebar Items */}
				{settings && settings.hiddenSidebarItems && sidebarItems[0].map((i) => (
					!settings.hiddenSidebarItems.includes(i.id) && (
						<MenuItem
							key={i.id}
							item={i}
							onClick={setSelected}
							selected={selected}
						/>
					)
				))}

				<div className="mt-8 mb-0 font-bold px-3 block sm:hidden xl:block sidebar-item">
					OTHER
				</div>

				{settings && settings.hiddenSidebarItems && sidebarItems[1].map((i) => (
					!settings.hiddenSidebarItems.includes(i.id) && (
						<MenuItem
							key={i.id}
							item={i}
							onClick={setSelected}
							selected={selected}
						/>
					)
				))}





				<div className="flex-grow" />
				<div>
					<div className="mt-8 mb-0 font-bold px-3 block sm:hidden xl:block sidebar-item">
						OTHER
					</div>
					{sidebarItems[2].map((i) => (
						<MenuItem
							key={i.id}
							item={i}
							onClick={setSelected}
							selected={selected}
						/>
					))}
				</div>


			</div>



			{/* Profile Display */}
			<div className="flex-shrink-0 overflow-hidden p-2">
				<div className="flex items-center h-full sm:justify-center xl:justify-start p-2 sidebar-separator-bottom">

					{/* <Image path="mock_faces_8" className="w-10 h-10" /> */}
					<div className="block sm:hidden xl:block ml-2 font-bold p-1">
						{
							globalProfile ? globalProfile.codename : "Log In"
						}
					</div>
					<div className="flex-grow block sm:hidden xl:block" />
					{/* <Icon
						path="res-react-dash-options"
						className="block sm:hidden xl:block w-3 h-3"
					/> */}
				</div>
			</div>



		</div>
	);
}




function MenuItem({ item: { id, title, link, notifications }, onClick, selected }) {
	return (
		<Link
			to={link}
			className={selected === id ? 'sidebar-item-selected' : 'sidebar-item'}
			onClick={() => onClick(id)}
		>
			<SidebarIcons id={id} />
			<div className="block sm:hidden xl:block ml-2">{title}</div>
			<div className="block sm:hidden xl:block flex-grow" />
			{
				notifications[0] && (
					<Badge
						color="primary"
						badgeContent={notifications[0]}
						sx={{ mr: 2 }}
					/>
				)
			}
			{
				notifications[1] && notifications[0] && (
					<Icon
						path="res-react-dash-sidebar-separator"
						className="w-2"
					/>
				)
			}
			{
				notifications[1] && (
					<Badge
						color="error"
						badgeContent={notifications[1]}
						sx={{ mr: 2 }}
					/>
				)
			}


		</Link >
	);
}

<svg width="512" height="512" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
	<path fill="#000000" d="M6 1v3H1V1h5zM1 0a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1V1a1 1 0 0 0-1-1H1zm14 12v3h-5v-3h5zm-5-1a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1h-5zM6 8v7H1V8h5zM1 7a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1H1zm14-6v7h-5V1h5zm-5-1a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1V1a1 1 0 0 0-1-1h-5z" />
</svg>



function SidebarIcons({ id }) {
	return (
		<svg
			className="w-8 h-8 xl:w-5 xl:h-5"
			viewBox="0 0 24 24"
			fill="currentColor"
			xmlns="http://www.w3.org/2000/svg"
		>
			{icons[id]}
		</svg>
	);
}





function Icon({ path = 'options', className = 'w-4 h-4' }) {
	return (
		<img
			src={`https://assets.codepen.io/3685267/${path}.svg`}
			alt=""
			className={clsx(className)}
		/>
	);
}





function IconButton({
	onClick = () => { },
	icon = 'options',
	className = 'w-4 h-4',
}) {
	return (
		<button onClick={onClick} type="button" className={className}>
			<img
				src={`https://assets.codepen.io/3685267/${icon}.svg`}
				alt=""
				className="w-full h-full"
			/>
		</button>
	);
}




// Avatar

// function Image({ path = '1', className = 'w-4 h-4' }) {
// 	return (
// 		<img
// 			src={`https://assets.codepen.io/3685267/${path}.jpg`}
// 			alt=""
// 			className={clsx(className, 'rounded-full')}
// 		/>
// 	);
// }
