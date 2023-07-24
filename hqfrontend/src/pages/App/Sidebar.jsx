import { useState, useEffect } from 'react';
import clsx from "clsx"
import './Sidebar.css'
import { Link } from 'react-router-dom'
import { useLocation } from "react-router-dom";
import { useQuery } from '@apollo/client';
import { useGlobalContext } from './GlobalContextProvider';
import { DailyReviewBadge, LogBadge, TodayBadge } from './Badges';
import { Badge } from '@mui/material';

// Queries and Mutations
import { GET_HIDDEN_SIDEBAR_ITEMS } from "../../models/settings"





// Sidebar
export default function Sidebar() {
	const { globalProfile } = useGlobalContext();
	const { hiddenItems, setHiddenItems } = useGlobalContext();
	const location = useLocation();
	const [selected, setSelected] = useState('0');

	useQuery(GET_HIDDEN_SIDEBAR_ITEMS, {
		onCompleted: (data) => {
			setHiddenItems(data.hiddenSidebarItems);
		},
	});


	const sidebarItems = [
		[
			{ id: '0', title: 'Today', link: '/', notifications: TodayBadge() },
			{ id: '1', title: 'Log', link: '/log', notifications: LogBadge() },
			// { id: '2', title: 'Inbox', link: '/inbox', notifications: 6 },
			{ id: '2', title: 'Inbox', link: '/inbox', notifications: false },
			{ id: '3', title: 'Projects', link: '/projects', notifications: false },
		],
		[
			{ id: '4', title: 'Habits', link: '/habits', notifications: false },
			{ id: '5', title: 'Rituals', link: '/rituals', notifications: false },
			{ id: '6', title: 'Reviews', link: '/dailyreview', notifications: DailyReviewBadge() },
			{ id: '8', title: 'Accountability', link: '/accountability', notifications: false },
			{ id: '11', title: 'To Dos', link: '/todos', notifications: false },
			{ id: '12', title: 'Plan', link: '/plan', notifications: false }
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
					<IconButton icon="res-react-dash-logo" className="w-10 h-10" />
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
				{sidebarItems[0].map((i) => (
					!hiddenItems.includes(i.id) && (
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

				{sidebarItems[1].map((i) => (
					!hiddenItems.includes(i.id) && (
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
			className={clsx(
				'w-full mt-6 flex items-center px-3 sm:px-0 xl:px-3 justify-start sm:justify-center xl:justify-start sm:mt-6 xl:mt-3 cursor-pointer',
				selected === id ? 'sidebar-item-selected' : 'sidebar-item',
			)}
			onClick={() => onClick(id)}
		>
			<SidebarIcons id={id} />
			<div className="block sm:hidden xl:block ml-2">{title}</div>
			<div className="block sm:hidden xl:block flex-grow" />
			{notifications[0] && (
				<Badge
					color="primary"
					badgeContent={notifications[0]}
					sx={{ mr: 2 }}
				/>
			)}
			{notifications[1] && notifications[0] && (
				<Icon
					path="res-react-dash-sidebar-separator"
					className="w-2"
				/>
			)}
			{notifications[1] && (
				<Badge
					color="error"
					badgeContent={notifications[1]}
					sx={{ mr: 2 }}
				/>
			)}


		</Link>
	);
}

<svg width="512" height="512" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
	<path fill="#000000" d="M6 1v3H1V1h5zM1 0a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1V1a1 1 0 0 0-1-1H1zm14 12v3h-5v-3h5zm-5-1a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1h-5zM6 8v7H1V8h5zM1 7a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1H1zm14-6v7h-5V1h5zm-5-1a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1V1a1 1 0 0 0-1-1h-5z" />
</svg>



function SidebarIcons({ id }) {
	const icons = {
		0: (
			<>
				<path d="M12 19C10.067 19 8.31704 18.2165 7.05029 16.9498L12 12V5C15.866 5 19 8.13401 19 12C19 15.866 15.866 19 12 19Z" />
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12ZM21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
				/>
			</>
		),
		1: (
			<>
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M3 5C3 3.34315 4.34315 2 6 2H14C17.866 2 21 5.13401 21 9V19C21 20.6569 19.6569 22 18 22H6C4.34315 22 3 20.6569 3 19V5ZM13 4H6C5.44772 4 5 4.44772 5 5V19C5 19.5523 5.44772 20 6 20H18C18.5523 20 19 19.5523 19 19V9H13V4ZM18.584 7C17.9413 5.52906 16.6113 4.4271 15 4.10002V7H18.584Z"
				/>
			</>
		),
		2: (
			<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
				<path d="M5 21q-.825 0-1.413-.588T3 19V5q0-.825.588-1.413T5 3h14q.825 0 1.413.588T21 5v14q0 .825-.588 1.413T19 21H5Zm7-5q.95 0 1.725-.55T14.8 14H19V5H5v9h4.2q.3.9 1.075 1.45T12 16Z" />
			</svg>
		),
		3: (
			<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
				<g>
					<path d="M14 3a2 2 0 0 1 1.995 1.85L16 5v1.055l3.641.976a2 2 0 0 1 1.448 2.304l-.034.145l-2.588 9.66a2 2 0 0 1-2.304 1.447l-.145-.033l-.587-.157c-.322.33-.759.55-1.246.595L14 21H5a2 2 0 0 1-1.995-1.85L3 19V5a2 2 0 0 1 1.85-1.995L5 3h9Zm0 2H5v14h9V5Zm2 3.126v10.353l.535.143l2.589-9.66L16 8.127Z" />
				</g>
			</svg>
		),
		4: (
			<>
				<svg xmlns="http://www.w3.org/2000/svg" className="ionicon" viewBox="0 0 512 512"><ellipse cx="256" cy="256" rx="267.57" ry="173.44" transform="rotate(-45 256 256.002)" fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="32" /><ellipse cx="256" cy="256" rx="267.57" ry="173.44" transform="rotate(-45 256 256.002)" fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="32" /><ellipse cx="256" cy="256" rx="267.57" ry="173.44" transform="rotate(-45 256 256.002)" fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="32" /><ellipse cx="256" cy="256" rx="267.57" ry="173.44" transform="rotate(-45 256 256.002)" fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="32" /><ellipse cx="256" cy="256" rx="267.57" ry="173.44" transform="rotate(-45 256 256.002)" fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="32" /><ellipse cx="256" cy="256" rx="267.57" ry="173.44" transform="rotate(-45 256 256.002)" fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="32" /></svg>
			</>
		),
		5: (
			<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
				<path d="M12.5 2c-1.66 0-3 3.34-3 5a3 3 0 0 0 3 3a3 3 0 0 0 3-3c0-1.66-1.34-5-3-5m0 4.5a1 1 0 0 1 1 1a1 1 0 0 1-1 1a1 1 0 0 1-1-1a1 1 0 0 1 1-1M10 11a1 1 0 0 0-1 1v8H7a1 1 0 0 1-1-1v-1a1 1 0 0 0-1-1a1 1 0 0 0-1 1v1a3 3 0 0 0 3 3h12a1 1 0 0 0 1-1a1 1 0 0 0-1-1h-3v-8a1 1 0 0 0-1-1h-5Z" />
			</svg>
		),
		6: (
			<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
				<g stroke="#000000">
					<path d="M3 4v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8h-4" />
					<path d="M3 4h14v14a2 2 0 0 0 2 2v0M13 8H7m6 4H9" />
				</g>
			</svg>
		),
		8: (
			<>
				<svg xmlns="http://www.w3.org/2000/svg" className="ionicon" viewBox="0 0 512 512"><circle cx="256" cy="352" r="112" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" /><circle cx="256" cy="352" r="48" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" /><path d="M147 323L41.84 159.32a32 32 0 01-1.7-31.61l31-62A32 32 0 0199.78 48h312.44a32 32 0 0128.62 17.69l31 62a32 32 0 01-1.7 31.61L365 323M371 144H37M428.74 52.6L305 250M140.55 144L207 250" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" /></svg>
			</>
		),
		11: (
			<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
				<path d="m9 20.42l-6.21-6.21l2.83-2.83L9 14.77l9.88-9.89l2.83 2.83L9 20.42Z" />
			</svg>
		),
		12: (
			<>
				<path d="M19 22H5C3.89543 22 3 21.1046 3 20V6C3 4.89543 3.89543 4 5 4H7V2H9V4H15V2H17V4H19C20.1046 4 21 4.89543 21 6V20C21 21.1046 20.1046 22 19 22ZM5 10V20H19V10H5ZM5 6V8H19V6H5ZM17 14H7V12H17V14Z" />
			</>
		),
	};
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
