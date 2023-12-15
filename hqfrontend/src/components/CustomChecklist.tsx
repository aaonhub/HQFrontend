import React from "react";
import { List, ListItem, ListItemButton, ListItemText, Paper, Checkbox } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { styled, keyframes } from "@mui/system";

export interface ChecklistItem {
    id: string;
    title: string;
    checked: boolean;
}

interface ListProps {
    list: ChecklistItem[];
    handleCheckItem: (listItem: any) => void;
    handleOrderChange?: (list: ChecklistItem[]) => void;
    checklistType: "strikeout" | "highlight"; 
}

// Define animation
const glow = keyframes`
  0% {
    box-shadow: 0 0 5px #5ea9dd, 0 0 10px #5ea9dd, 0 0 15px #5ea9dd, 0 0 20px #5ea9dd;
  }
  100% {
    box-shadow: 0 0 10px #5ea9dd, 0 0 15px #5ea9dd, 0 0 20px #5ea9dd, 0 0 25px #5ea9dd, 0 0 30px #5ea9dd;
  }
`;

const GlowPaper = styled(Paper)(({ theme }) => ({
    // Apply animation
    animation: `${glow} 2s ease-in-out infinite alternate`,
}));

const CustomList: React.FC<ListProps> = ({ list, handleCheckItem, checklistType }) => {
    const theme = useTheme()

    return (
        <List>
            {list.map((listItem) => (
                <ListItem key={listItem.id} disablePadding>
                    {listItem.checked && checklistType === "highlight" ? (
                        <GlowPaper
                            elevation={1}
                            onClick={() => handleCheckItem(listItem)}
                            sx={{
                                width: "100%",
                                mb: 1,
                                backgroundColor: theme.palette.background.default,
                            }}
                        >
                            <ListItemButton>
                                <ListItemText
                                    primary={listItem.title}
                                />

                                <Checkbox
                                    edge="end"
                                    checked={listItem.checked}
                                    onChange={() => handleCheckItem(listItem)}
                                    onClick={(e) => e.stopPropagation()}
                                    color="primary"
                                />
                            </ListItemButton>
                        </GlowPaper>
                    ) : (
                        <Paper
                            elevation={1}
                            onClick={() => handleCheckItem(listItem)}
                            sx={{
                                width: "100%",
                                mb: 1,
                                ...(listItem.checked && checklistType === "strikeout" && { textDecoration: "line-through" }),
                            }}
                        >
                            <ListItemButton>
                                <ListItemText
                                    primary={listItem.title}
                                />

                                <Checkbox
                                    edge="end"
                                    checked={listItem.checked}
                                    onChange={() => handleCheckItem(listItem)}
                                    onClick={(e) => e.stopPropagation()}
                                    color="primary"
                                />
                            </ListItemButton>
                        </Paper>
                    )}
                </ListItem>
            ))}
        </List>
    )
}

export default CustomList
