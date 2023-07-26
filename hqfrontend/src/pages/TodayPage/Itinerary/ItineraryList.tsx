import React, { useEffect, useState } from 'react'
import { Checkbox, List, ListItem, ListItemText } from '@mui/material'
import { Draggable } from '@fullcalendar/interaction'
import { v4 as uuidv4 } from 'uuid';
import { addLengthToTime, currentLocalTime, getCurrentLocalDate, getCurrentLocalDateUnadjusted } from '../../../components/DateFunctions';
import DescriptionIcon from '@mui/icons-material/Description';
import { ReactSortable, SortableEvent } from 'react-sortablejs'
import EventIcon from '@mui/icons-material/Event';
import { motion, AnimatePresence } from "framer-motion";


// Models
import SimpleItem from '../../../models/simpleitem';


interface ItineraryListProps {
	list: SimpleItem[]
	setList: any
	setSelectedInboxItemId: any
	setSelectedHabitId: any
	handleCheckItem: any
}

const ItineraryList: React.FC<ItineraryListProps> = ({ list, setSelectedInboxItemId, setSelectedHabitId, handleCheckItem, setList }) => {
	const [id] = useState(uuidv4());



	// Calendar Stuff
	useEffect(() => {
		let draggableEl = document.getElementById(id)

		if (draggableEl) {
			new Draggable(draggableEl, {
				itemSelector: '.event-class',
				eventData: function (eventEl) {
					let event = JSON.parse(eventEl.getAttribute('data-event') ?? '{}')
					return {
						title: event?.id + '|' + event?.title,
						duration: event?.duration,
					}
				}
			})
		}
	}, [id])





	// Sortable Stuff
	const handleOrderChange = (evt: SortableEvent) => {
		const newIndex = evt.newIndex
		const oldIndex = evt.oldIndex

		if (typeof newIndex === 'undefined' || typeof oldIndex === 'undefined') {
			return
		}

		const newOrder = [...list]
		newOrder.splice(newIndex, 0, newOrder.splice(oldIndex, 1)[0])

		setList(newOrder)
	}


	return (
		<List
			sx={{ padding: 0 }}
			id={id}
		>
			<ReactSortable
				list={list}
				setList={setList}
				animation={150}
				onEnd={handleOrderChange}
			>
				<AnimatePresence>
					{list.map((item: any) => {


						// Border color
						let color = "grey"
						if (!item.startDate) {
							item.startDate = getCurrentLocalDate()
						}

						if (item.startDate < getCurrentLocalDateUnadjusted()) {
							color = "red"
						} else if (!item.startTime) {
							color = "grey"
						} else if (item.completedToday) {
							color = "grey"
						} else
							if (item.startTime < currentLocalTime()) {
								if (!item.length) {
									color = "red"
								} else {
									if (addLengthToTime(item.startTime, item.length) > currentLocalTime()) {
										color = "blue"
									} else {
										color = "red"
									}
								}
							}

						let itemColor;
						if (color === "red") itemColor = '1px solid red';
						else if (color === "blue") itemColor = '1px solid cyan';
						else itemColor = '1px solid grey';

						return (
							<motion.li
								key={item.id}
								initial={{ opacity: 1, y: 0 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, height: 0 }}
								transition={{
									y: {
										type: "spring",
										stiffness: 50,
										damping: 20,   // Added damping
										mass: 1,       // Added mass
									},
									default: { duration: 1 },
								}}
								style={{ overflow: "hidden" }}
							>
								<ListItem
									key={item.id}
									disablePadding
									onClick={() => {
										if ("i" === item.id.slice(-1)) {
											setSelectedInboxItemId(item.id.slice(0, -1))
										}
										if ("h" === item.id.slice(-1)) {
											setSelectedHabitId(item.id.slice(0, -1))
										}
									}}
									sx={{
										borderRadius: 2,
										border: itemColor,
										marginBottom: 1,
										cursor: 'pointer',
										'&:hover': {
											backgroundColor: 'black',
										},
									}}
								>
									<div
										style={{
											width: 5,
											height: '100%',
											backgroundColor: "black",
											marginRight: 1,
										}}
									/>

									<Checkbox
										checked={item.completedToday}
										onClick={(event) => {
											event.stopPropagation()
											handleCheckItem(item)
										}}
										sx={{
											marginRight: 1,
										}}
									/>

									<ListItemText
										primary={item.title}
										secondary={
											<span style={{ display: 'flex', alignItems: 'center' }}>
												{item.description && (
													<DescriptionIcon style={{ fontSize: '1rem', marginRight: '0.5rem' }} />
												)}
												{item.startTime?.slice(0, -3)}
											</span>
										}
									/>

									<EventIcon
										className="event-class"
										data-event={JSON.stringify({
											id: item.id,
											title: item.title,
											duration: item.length,
										})}
										sx={{
											marginRight: 2,
											marginLeft: 1,
											cursor: 'grab',
											// backgroundColor: "red",
											height: "100%",
										}}
									/>

								</ListItem>
							</motion.li>
						)
					})}
				</AnimatePresence>
			</ReactSortable>
		</List>
	)
}

export default ItineraryList
