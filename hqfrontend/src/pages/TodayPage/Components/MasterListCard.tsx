import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@mui/material";
import { useMutation, useQuery } from '@apollo/client';
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import EditInboxItemDialog from "../../../components/EditToDoItemDialog";
import ToDoItemButton from "../../../components/ToDoItemButton";
import { useGlobalContext } from "../../App/GlobalContextProvider";
import { sortObjectsByIds } from "../../../components/MiscFunctions";

// Queries
import { MASTER_LIST_QUERY } from "../../../models/inboxitem";
// Mutations
import { CHECK_UNCHECK_TODO } from "../../../models/inboxitem";
import { UPDATE_SETTINGS } from "../../../models/settings";


const MasterList = () => {
    const { setDebugText } = useGlobalContext()
    const [list, setList] = useState<any[]>([]);
    const [selectedToDoItem, setSelectedToDoItem] = useState<any>(null);

    // Debug
    useEffect(() => {
        setDebugText([
            { title: "Local Storage Settings", content: localStorage.getItem("settings") }
        ])
    }, [list]);


    // Query
    const { loading, error } = useQuery(MASTER_LIST_QUERY, {
        onCompleted: (data) => {
            const masterListItems = data.masterListItems;
            const masterListOrder = JSON.parse(data.settings.masterListOrder);
            const sortedList = sortObjectsByIds(masterListItems, masterListOrder);
            setList(sortedList);
        },
        onError: (error) => {
            console.log(error);
        }
    });


    // Update Master List Order
    const [updateSettings] = useMutation(UPDATE_SETTINGS);
    const handleUpdateSettings = (order: any) => {
        const masterListOrder = JSON.stringify(order.map((item: any) => item.id))
        updateSettings({
            variables: {
                masterListOrder: masterListOrder
            },
            onCompleted: (data) => {
                console.log(data);
                localStorage.setItem("settings", JSON.stringify(data.updateSettings));
            }
        });
    };


    // Check To Do
    const [checkUncheckTodo] = useMutation(CHECK_UNCHECK_TODO, {
        onCompleted: (data) => {
            console.log(data);
        }
    });
    const handleCheckUncheckTodo = (item: any) => {
        checkUncheckTodo({
            variables: {
                id: item.id,
                Completed: !item.completed
            }
        });
    };

    const handleClick = (id: string) => {
        setSelectedToDoItem(id);
    };

    const onDragEnd = (result: any) => {
        if (!result.destination) return;

        const items = Array.from(list);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setList(items);
        handleUpdateSettings(items);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    return (
        <Card
            sx={{ borderRadius: 2, margin: 1 }}
            style={{ height: '80vh', overflowY: 'auto' }}
        >
            <CardHeader title="Master List" />

            <CardContent>
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="droppable">
                        {(provided) => (
                            <div {...provided.droppableProps} ref={provided.innerRef}>
                                {list.map((item, index) => (
                                    <Draggable key={item.id} draggableId={item.id} index={index}>
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                            >
                                                <ToDoItemButton
                                                    id={item.id}
                                                    title={item.title}
                                                    description={item.description}
                                                    completed={item.completed}
                                                    handleCheckItem={handleCheckUncheckTodo}
                                                    handleClick={handleClick}
                                                />
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </CardContent>

            {selectedToDoItem && (
                <EditInboxItemDialog
                    handleClose={() => setSelectedToDoItem(null)}
                    inboxItemId={selectedToDoItem}
                />
            )}
        </Card>
    );
}

export default MasterList;
