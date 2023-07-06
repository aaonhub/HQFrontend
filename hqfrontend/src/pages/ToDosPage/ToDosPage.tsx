import { Button, Container, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useMutation, useQuery } from '@apollo/client';
import { useEffect, useRef, useState } from 'react';
import EditToDoItemDialog from '../../components/EditToDoItemDialog';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useGlobalContext } from '../App/GlobalContextProvider';
import dayjs from 'dayjs';

// Queries and Mutations
import { TO_DO_ITEM_PAGINATION } from '../../models/inboxitem';
import { ADD_TODO } from '../../models/inboxitem';


type Node = {
    id: string;
    title: string;
    completed: boolean;
    startDate: string;
    dueDateTime: string;
    description: string;
    createdAt: string;
};

interface Edge {
    node: Node;
}


const ToDosPage = () => {
    const { setSnackbar } = useGlobalContext();
    const [rows, setRows] = useState<Node[]>([]);
    const [endCursor, setEndCursor] = useState<string>('');
    const [hasNextPage, setHasNextPage] = useState<boolean>(false);
    const [selectedRow, setSelectedRow] = useState<Node | null>(null);
    const [sortBy, setSortBy] = useState<string>('-created_at');
    const [newTodo, setNewTodo] = useState<string>('');


    const rowsRef = useRef<Record<string, Node>>({});


    // To Dos Query
    const { loading, error, data, fetchMore, refetch } = useQuery(TO_DO_ITEM_PAGINATION, {
        variables: {
            orderBy: sortBy,
            title_Icontains: '',
            completed: false,
        },
        onCompleted: (data) => {
            setEndCursor(data.toDoItems.pageInfo.endCursor);
            setHasNextPage(data.toDoItems.pageInfo.hasNextPage);
        }
    });



    const handleSortByChange = (event: any) => {
        setSortBy(event.target.value as string);
        setRows([]);
        refetch({
            orderBy: event.target.value as string,
        });
    };


    const columns: GridColDef[] = [
        { field: 'title', headerName: 'Title', width: 400 },
        { field: 'completed', headerName: 'Completed', width: 150 },
        { field: 'startDate', headerName: 'Start Date', width: 150 },
        {
            field: 'dueDateTime',
            headerName: 'Due Date Time',
            width: 150,
            valueFormatter: (params) => {
                if (params.value) {
                    return dayjs(params.value).format('MM/DD/YYYY');
                } else {
                    return "";
                }
            }
        },
        // { field: 'description', headerName: 'Description', width: 300 },
        {
            field: 'createdAtFormatted',
            headerName: 'Created At',
            width: 300,
            sortComparator: (v1, v2, cellParams1, cellParams2) => {
                const row1 = rowsRef.current[cellParams1.id];
                const row2 = rowsRef.current[cellParams2.id];
                return new Date(row1.createdAt).getTime() - new Date(row2.createdAt).getTime();
            },
        },
    ];



    function formatDate(input: string): string {
        const date = new Date(input);
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    }


    const fetchMoreData = () => {
        fetchMore({
            variables: {
                after: endCursor,
            },
        }).then(fetchMoreResult => {
            const newRows = fetchMoreResult.data.toDoItems.edges.map((edge: Edge) => {
                const node = { ...edge.node, createdAtFormatted: formatDate(edge.node.createdAt) };
                rowsRef.current[node.id] = node; // Update rowsRef
                return node;
            });
            setEndCursor(fetchMoreResult.data.toDoItems.pageInfo.endCursor);
            setRows(oldRows => [...oldRows, ...newRows]);
            setHasNextPage(fetchMoreResult.data.toDoItems.pageInfo.hasNextPage);
        });
    }

    const [addTodo] = useMutation(ADD_TODO, {
        onCompleted: (data) => {
            setSnackbar({
                open: true,
                message: 'To Do Added',
                severity: 'success',
            });
            setNewTodo('');
            setRows([]);
            refetch();

        }
    });
    const handleAddTodo = () => {
        addTodo({
            variables: {
                title: newTodo,
                completed: false,
            }
        });
    };






    useEffect(() => {
        if (data?.toDoItems.edges.length) {
            const newRows = data.toDoItems.edges.map((edge: Edge) => {
                const node = { ...edge.node, createdAtFormatted: formatDate(edge.node.createdAt) };
                rowsRef.current[node.id] = node; // Update rowsRef
                return node;
            });
            setRows(oldRows => [...oldRows, ...newRows]);
        }
    }, [data]);




    const totalDBRowCount = data?.toDoItemPaginationCount ?? 0;
    const totalFetched = rows.length;


    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    return (
        <>
            <Container maxWidth="xl">
                <Grid container direction="column" spacing={2}>

                    <Grid item xs={12}>
                        <Typography variant="h4" component="h1" gutterBottom>
                            Fetched {totalFetched} of {totalDBRowCount} total rows.
                        </Typography>
                    </Grid>

                    {/* Input */}
                    <Grid item xs={12} container spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                                id="standard-basic"
                                label="Add To Do"
                                fullWidth
                                value={newTodo}
                                onChange={(event) => setNewTodo(event.target.value)}
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter') {
                                        handleAddTodo();
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleAddTodo}
                            >
                                Add
                            </Button>
                        </Grid>
                    </Grid>

                    {/* Filters and Sorters */}
                    <Grid item xs={12} direction={"row"} container spacing={2}>

                        <Grid item xs={4}>
                            <FormControl fullWidth>
                                <InputLabel id="sort-by">Sort By</InputLabel>
                                <Select
                                    labelId="sort-by-select-label"
                                    id="sort-by-select"
                                    value={sortBy}
                                    label="Sort By"
                                    onChange={(event) => handleSortByChange(event)}
                                >
                                    <MenuItem value={"-created_at"}>Created Date</MenuItem>
                                    <MenuItem value={"title"}>Title</MenuItem>
                                    <MenuItem value={"start_date"}>Start Date</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* <Grid item xs={4}>
                            <TextField
                                id="standard-basic"
                                label="Search"
                                fullWidth
                            />
                        </Grid> */}

                    </Grid>

                    {/* Table */}
                    <Grid item xs={12} style={{ width: '100%', overflowX: 'auto' }}>
                        <InfiniteScroll
                            dataLength={rows.length}
                            next={fetchMoreData}
                            hasMore={hasNextPage}
                            loader={<h4>Loading...</h4>}
                        >
                            <div style={{ width: 'max-content' }}>
                                <DataGrid
                                    rows={rows.map(row => ({ ...row, id: row.id }))}
                                    columns={columns}
                                    checkboxSelection
                                    onRowClick={(rowParams) => setSelectedRow(rowParams.row)}
                                    disableRowSelectionOnClick
                                />
                            </div>
                        </InfiniteScroll>
                    </Grid>

                </Grid>
            </Container>

            {selectedRow &&
                <EditToDoItemDialog
                    handleClose={() => setSelectedRow(null)}
                    inboxItemId={selectedRow.id}
                />
            }

        </>
    );
};


export default ToDosPage;
