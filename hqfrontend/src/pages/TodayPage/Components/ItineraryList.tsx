import React, { useEffect, useState } from 'react';
import { Checkbox, List, ListItem, ListItemText, Typography, useTheme } from '@mui/material';
import { Draggable } from '@fullcalendar/interaction';
import { v4 as uuidv4 } from 'uuid';
import { addLengthToTime, currentLocalTime, getCurrentLocalDate, getCurrentLocalDateUnadjusted } from '../../../components/DateFunctions';
import DescriptionIcon from '@mui/icons-material/Description';
import { ReactSortable, SortableEvent } from 'react-sortablejs';
import EventIcon from '@mui/icons-material/Event';
import { motion, AnimatePresence } from "framer-motion";

// Models
import SimpleItem from '../../../models/simpleitem';

interface ItineraryListProps {
	list: SimpleItem[];
	setList: any;
	setSelectedInboxItemId: any;
	setSelectedHabitId: any;
	setSelectedRitualId: any;
	setSelectedEntryID: any;
	handleCheckItem: any;
}

const ItineraryList: React.FC<ItineraryListProps> = ({
	list,
	setList,
	setSelectedInboxItemId,
	setSelectedHabitId,
	setSelectedRitualId,
	setSelectedEntryID,
	handleCheckItem
}) => {
	const theme = useTheme();
	const [id] = useState(uuidv4());

	useEffect(() => {
		let draggableEl = document.getElementById(id);

		if (draggableEl) {
			new Draggable(draggableEl, {
				itemSelector: '.event-class',
				eventData: function (eventEl) {
					let event = JSON.parse(eventEl.getAttribute('data-event') ?? '{}');
					return {
						title: event?.id + '|' + event?.title,
						duration: event?.duration,
					};
				}
			});
		}
	}, [id]);

	const handleOrderChange = (evt: SortableEvent) => {
		const newIndex = evt.newIndex;
		const oldIndex = evt.oldIndex;

		if (typeof newIndex === 'undefined' || typeof oldIndex === 'undefined') {
			return;
		}

		const newOrder = [...list];
		newOrder.splice(newIndex, 0, newOrder.splice(oldIndex, 1)[0]);

		setList(newOrder);
	};

	if (list.length === 0) {
		return (
			<Typography variant="h6" align="center" color="textSecondary">
				No items
			</Typography>
		);
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
					{list.map((item: SimpleItem) => {
						let borderColor;
						if (item.startDate && item.startDate < getCurrentLocalDateUnadjusted()) {
							borderColor = theme.palette.error.main;
						} else if (item.completedToday) {
							borderColor = theme.palette.grey[500];
						} else {
							borderColor = theme.palette.primary.main;
						}

						return (
							<motion.div
								key={item.id}
								initial={{ opacity: 1, y: 0 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, height: 0 }}
								transition={{
									y: {
										type: "spring",
										stiffness: 50,
										damping: 20,
										mass: 1,
									},
									default: { duration: .5 },
								}}
								style={{ overflow: "hidden" }}
							>
								<ListItem
									disablePadding
									onClick={() => {
										if (item.type === "inbox") {
											setSelectedInboxItemId(item.id);
										} else if (item.type === "habit") {
											setSelectedHabitId(item.id);
										} else if (item.type === "ritual") {
											setSelectedRitualId(item.id);
											setSelectedEntryID(item.id);
										}
									}}
									sx={{
										borderRadius: 2,
										border: `1px solid ${borderColor}`,
										marginBottom: 1,
										cursor: 'pointer',
										'&:hover': {
											backgroundColor: theme.palette.action.hover,
										},
									}}
								>
									<Checkbox
										checked={item.completedToday}
										onClick={(event) => {
											event.stopPropagation();
											handleCheckItem(item);
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
											color: item.type === 'ritual' ? theme.palette.error.main :
												item.type === 'habit' ? theme.palette.success.main :
													theme.palette.info.main
										}}
									/>

								</ListItem>
							</motion.div>
						);
					})}
				</AnimatePresence>
			</ReactSortable>
		</List>
	);
}

export default ItineraryList;
