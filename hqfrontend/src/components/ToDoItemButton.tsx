import { Checkbox, ListItem, ListItemText, useTheme } from "@mui/material"
import DescriptionIcon from '@mui/icons-material/Description'
import EventIcon from '@mui/icons-material/Event'

interface ToDoItemButtonProps {
    id: string
    title: string
    description?: string
    completed: boolean
    handleCheckItem: any
    handleClick: (id: string) => void
}


const ToDoItemButton = (props: ToDoItemButtonProps) => {
    const theme = useTheme()

    return (
        <ListItem
            key={props.id}
            disablePadding
            onClick={() => {
                props.handleClick(props.id)
            }}
            sx={{
                borderRadius: 2,
                marginBottom: 1,
                cursor: 'pointer',
                '&:hover': {
                    backgroundColor: theme.palette.action.hover,
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
                checked={props.completed}
                onClick={(event) => {
                    event.stopPropagation()
                    props.handleCheckItem(props.id)
                }}
                sx={{
                    marginRight: 1,
                }}
            />

            <ListItemText
                primary={props.title}
                secondary={
                    <span style={{ display: 'flex', alignItems: 'center' }}>
                        {props.description && (
                            <DescriptionIcon style={{ fontSize: '1rem', marginRight: '0.5rem' }} />
                        )}
                    </span>
                }
            />

            {/* <EventIcon
                className="event-class"
                data-event={JSON.stringify({
                    id: props.id,
                    title: props.title,
                })}
                sx={{
                    marginRight: 2,
                    marginLeft: 1,
                    cursor: 'grab',
                    height: "100%"
                }}
            /> */}

        </ListItem>
    )
}

export default ToDoItemButton
