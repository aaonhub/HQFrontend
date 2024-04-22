import React, { useEffect, useState } from "react";
import { Box, Card, CardContent, CardHeader, IconButton, Input } from "@mui/material";
import { useMutation, useQuery } from '@apollo/client';
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import EditInboxItemDialog from "../../../components/EditToDoItemDialog";
import ToDoItemButton from "../../../components/ToDoItemButton";
import { useGlobalContext } from "../../App/GlobalContextProvider";
import { sortObjectsByIds } from "../../../components/MiscFunctions";
import AddIcon from '@mui/icons-material/Add'

// Queries
import { MASTER_LIST_QUERY } from "../../../models/inboxitem";
// Mutations
import { CHECK_UNCHECK_TODO } from "../../../models/inboxitem";
import { UPDATE_SETTINGS } from "../../../models/settings";
import { currentYYYYMMDD } from "../../../components/DateFunctions";
import { ADD_TODO_TO_MASTER_LIST } from "../../../models/inboxitem";


const MasterList = () => {
    const { setDebugText, setSnackbar } = useGlobalContext()
    const [list, setList] = useState<any[]>([]);
    const [selectedToDoItem, setSelectedToDoItem] = useState<any>(null);
    const [inputValue, setInputValue] = useState('')

    // Debug
    useEffect(() => {
        setDebugText([
            { title: "Local Storage Settings", content: localStorage.getItem("settings") }
        ])
    }, [list, setDebugText])


    // Query
    const { loading, error, refetch } = useQuery(MASTER_LIST_QUERY, {
        fetchPolicy: "network-only",
        onCompleted: (data) => {
            handleQueryCompleted(data)
        },
        onError: (error) => {
            console.log(error);
        }
    });


    const handleQueryCompleted = (data: any) => {
        const masterListItems = data.masterListItems;
        const masterListOrder = JSON.parse(data.settings.masterListOrder);
        const sortedList = sortObjectsByIds(masterListItems, masterListOrder);
        setList(sortedList);
    }


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
        console.log(item)
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

    const [addTodoToMasterList] = useMutation(ADD_TODO_TO_MASTER_LIST)
    const handleAddItem = () => {

        // Error Handling
        if (!inputValue.trim()) {
            setSnackbar({ message: "Please enter a title", open: true, severity: "error" })
            return
        }

        // Add inbox item mutation
        addTodoToMasterList({
            variables: {
                title: inputValue,
                masterList: true,
            },
            onCompleted: () => {
                setInputValue('')
                setSnackbar({ message: "Added to Master List", open: true, severity: "success" })
                refetch().then(({ data }) => {
                    handleQueryCompleted(data);
                });
            },
            onError: (error) => {
                console.log(error)
            }
        })
    }

    // Paste Event Handler
    const handlePaste = async (event: React.ClipboardEvent) => {
        event.preventDefault() // Prevent the paste from happening right away

        const pasteData = event.clipboardData.getData('text') // Get the data from the clipboard
        const lines = pasteData.split('\n') // Split the pasted data by new line

        if (lines.length > 1) { // If there are multiple lines
            if (!window.confirm(`You are about to create ${lines.length} to do items. Continue?`)) {
                return
            }
            for (const line of lines) {
                if (!line.trim()) { // If line is only whitespace
                    continue
                }

                await addTodoToMasterList({
                    variables: {
                        title: line,
                        startDate: currentYYYYMMDD(),
                        Completed: false,
                    },
                })
            }
        } else { // If there is only one line
            setInputValue(inputValue + pasteData) // Paste the data into the input field
        }
    }

    const handleClose = () => {
        setSelectedToDoItem(null);
        refetch().then(({ data }) => {
            handleQueryCompleted(data);
        });
    }


    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    return (
        <Card
            sx={{ borderRadius: 2, margin: 1 }}
            style={{ height: '80vh', overflowY: 'auto' }}
        >
            <CardHeader title="Master List" />

            <CardContent>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {/* To Do Input */}
                    <Input
                        placeholder="Add item"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onPaste={handlePaste}
                        fullWidth
                        inputProps={{ style: { paddingLeft: "5px" } }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleAddItem()
                            }
                        }}
                    />
                    <IconButton onClick={handleAddItem}>
                        <AddIcon />
                    </IconButton>
                </Box>

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
                                                    handleCheckItem={() => handleCheckUncheckTodo(item)}
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
                    handleClose={handleClose}
                    inboxItemId={selectedToDoItem}
                />
            )}
        </Card>
    );
}

export default MasterList;
