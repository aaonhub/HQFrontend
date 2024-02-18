import { FC, useEffect, useState } from 'react';
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
    const [isUpdating, setIsUpdating] = useState(false);

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


    const ensureArray = (possibleArray: any): string[] => {
        try {
            // Attempt to parse if it's a string
            if (typeof possibleArray === 'string') {
                const parsed = JSON.parse(possibleArray);
                return Array.isArray(parsed) ? parsed : [];
            }
            // Directly return if it's already an array
            return Array.isArray(possibleArray) ? possibleArray : [];
        } catch (e) {
            // Return an empty array if parsing fails or it's not an array
            return [];
        }
    };

    const toggleItemVisibilityOptimistic = async (id: string) => {
        if (isUpdating) return; // Prevent further updates while one is in progress

        setIsUpdating(true);
        const currentHiddenItems = ensureArray(settings.hiddenSidebarItems);
        const newHiddenItems = currentHiddenItems.includes(id)
            ? currentHiddenItems.filter(item => item !== id)
            : [...currentHiddenItems, id];

        // Optimistically update the UI
        setSettings({
            ...settings,
            hiddenSidebarItems: newHiddenItems,
        });

        try {
            await updateHiddenSidebarItems({
                variables: {
                    hiddenSidebarItems: JSON.stringify(newHiddenItems),
                },
            });
            // Success: The UI is already updated optimistically
        } catch (error) {
            console.error(error);
            // Failure: Roll back to the previous state or show an error
        } finally {
            setIsUpdating(false);
        }
    };



    console.log(settings.hiddenSidebarItems);

    return (
        <List>
            {ids.map((id) => (
                <ListItem key={id}>
                    <IconButton edge="start" onClick={() => toggleItemVisibilityOptimistic(id)}>
                        {ensureArray(settings.hiddenSidebarItems).includes(id) ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                    <ListItemText primary={titles[id]} />
                </ListItem>
            ))}
        </List>
    );
}

export default SidebarSettings;
