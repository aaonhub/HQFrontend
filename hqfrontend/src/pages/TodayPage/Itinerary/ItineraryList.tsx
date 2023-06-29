import React, { useEffect, useState } from 'react'
import { Checkbox, List, ListItem, ListItemText } from '@mui/material'
import { Draggable } from '@fullcalendar/interaction'
import { v4 as uuidv4 } from 'uuid';

interface ItineraryListProps {
    list: any
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
            {list.map((item: any) => (
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
                        borderRadius: 2, border: '1px solid grey', marginBottom: 1, cursor: 'pointer',
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
                        secondary={item.startTime?.slice(0, -3)}
                    />
                </ListItem>
            ))}
        </List>
    )
}

export default ItineraryList
