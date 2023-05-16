import React from "react"
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, Checkbox } from "@mui/material"
import { useTheme } from "@mui/material/styles"
import InboxIcon from "@mui/icons-material/Inbox"

export interface ChecklistItem {
    id: string
    title: string
    completed: boolean
}

interface ListProps {
    list: ChecklistItem[]
    handleCheckItem: (listItem: ChecklistItem) => void
    handleOrderChange?: (list: ChecklistItem[]) => void
}

const CustomList: React.FC<ListProps> = ({ list, handleCheckItem }) => {
    const theme = useTheme()

    return (
        <List>
            {list.map((listItem) => (
                <ListItem key={listItem.id} disablePadding>
                    <Paper
                        elevation={1}
                        onClick={() => handleCheckItem(listItem)}
                        sx={{
                            width: "100%",
                            mb: 1,
                            ...(listItem.completed && {
                                backgroundColor: theme.palette.background.default,
                            }),
                        }}
                    >
                        <ListItemButton>
                            {/* <ListItemIcon>
                                <InboxIcon sx={{ color: listItem.completed ? "grey" : "#3f51b5" }} />
                            </ListItemIcon> */}

                            <ListItemText
                                primary={listItem.title}
                                sx={{
                                    ...(listItem.completed && { textDecoration: "line-through" }),
                                }}
                            />

                            <Checkbox
                                edge="end"
                                checked={listItem.completed}
                                onChange={() => handleCheckItem(listItem)}
                                onClick={(e) => e.stopPropagation()}
                                color="primary"
                            />
                        </ListItemButton>
                    </Paper>
                </ListItem>
            ))}
        </List>
    )
}

export default CustomList