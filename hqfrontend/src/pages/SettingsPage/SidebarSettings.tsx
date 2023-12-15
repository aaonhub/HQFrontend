import React, { FC, useEffect } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useGlobalContext } from '../App/GlobalContextProvider';
import { useMutation } from '@apollo/client';

// Queries and Mutations
import { UPDATE_SETTINGS } from '../../models/settings';


interface TitleMapping {
    [key: string]: string;
}

const SidebarSettings: FC = () => {
    const { settings, setSettings } = useGlobalContext();
    const ids = [
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "8",
        "11",
        "12",
    ];

    const titles: TitleMapping = {
        "0": "Today",
        "1": "Log",
        "2": "Inbox",
        "3": "Projects",
        "4": "Habits",
        "5": "Rituals",
        "6": "Reviews",
        "8": "Accountability",
        "11": "To Dos",
        "12": "Plan",
    };

    const [updateHiddenSidebarItems] = useMutation(UPDATE_SETTINGS);


    const toggleItemVisibility = (id: string) => {
        setSettings({
            ...settings,
            hiddenSidebarItems: settings.hiddenSidebarItems.includes(id)
                ? settings.hiddenSidebarItems.filter((item: any) => item !== id)
                : [...settings.hiddenSidebarItems, id],
        });
    };


    useEffect(() => {
        updateHiddenSidebarItems({
            variables: {
                hiddenSidebarItems: JSON.stringify(settings.hiddenSidebarItems)
            },
            onCompleted: (data) => {
                localStorage.setItem("settings", JSON.stringify(data.updateSettings));
            },
            onError: (error) => {
                console.log(error);
            }
        });
    }, [settings, updateHiddenSidebarItems]);



    return (
        <List>
            {ids.map((id) => (
                <ListItem key={id}>
                    <IconButton edge="start" onClick={() => toggleItemVisibility(id)}>
                        {settings.hiddenSidebarItems.includes(id) ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                    <ListItemText primary={titles[id]} /> {/* Moved after IconButton */}
                </ListItem>
            ))}
        </List>
    );
}

export default SidebarSettings;
