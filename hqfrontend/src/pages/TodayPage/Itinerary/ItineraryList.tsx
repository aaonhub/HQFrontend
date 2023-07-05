import React, { useEffect, useState } from 'react'
import { Checkbox, List, ListItem, ListItemText } from '@mui/material'
import { Draggable } from '@fullcalendar/interaction'
import { v4 as uuidv4 } from 'uuid';
import { addLengthToTime, currentLocalTime, getCurrentLocalDate, getCurrentLocalDateUnadjusted } from '../../../components/DateFunctions';
import DescriptionIcon from '@mui/icons-material/Description';

// Models
import SimpleItem from '../../../models/simpleitem';


interface ItineraryListProps {
	list: SimpleItem[]
	setSelectedInboxItemId: any
	setSelectedHabitId: any
	handleCheckItem: any
}

const ItineraryList: React.FC<ItineraryListProps> = ({ list, setSelectedInboxItemId, setSelectedHabitId, handleCheckItem }) => {
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

	return (
		<List
			sx={{ padding: 0 }}
			id={id}
		>
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
					<ListItem
						key={item.id}
						disablePadding
						className="event-class"
						data-event={JSON.stringify({
							id: item.id,
							title: item.title,
							duration: item.length,
						})}

						onClick={() => {
							if ("i" === item.id.slice(-1)) {
								setSelectedInboxItemId(item.id.slice(0, -1))
							}
							if ("h" === item.id.slice(-1)) {
								setSelectedHabitId(item.id.slice(0, -1))
							}
						}}
						sx={{
							borderRadius: 2, border: itemColor, marginBottom: 1, cursor: 'pointer',
							'&:hover': {
								backgroundColor: 'black',
							},
						}}
					>
						<Checkbox
							checked={item.completedToday}
							onClick={(event) => {
								event.stopPropagation()
								handleCheckItem(item)
							}}
						/>
						<ListItemText
							primary={item.title}
							secondary={
								<div style={{ display: 'flex', alignItems: 'center' }}>
									{item.description && (
										<DescriptionIcon style={{ fontSize: '1rem', marginRight: '0.5rem' }} />
									)}
									{item.startTime?.slice(0, -3)}
								</div>
							}
						/>
					</ListItem>
				)
			})}
		</List>
	)
}

export default ItineraryList
