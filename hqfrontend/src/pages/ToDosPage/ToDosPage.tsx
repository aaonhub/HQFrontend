import { Container, FormControl, Grid, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useQuery } from '@apollo/client';
import { useEffect, useRef, useState } from 'react';
import EditToDoItemDialog from '../../components/EditToDoItemDialog';
import InfiniteScroll from 'react-infinite-scroll-component';

// Queries and Mutations
import { TO_DO_ITEM_PAGINATION } from '../../models/inboxitem';


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
    const [rows, setRows] = useState<Node[]>([]);
    const [endCursor, setEndCursor] = useState<string>('');
    const [hasNextPage, setHasNextPage] = useState<boolean>(false);
    const [selectedRow, setSelectedRow] = useState<Node | null>(null);
    const [sortBy, setSortBy] = useState<string>('-created_at');


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
        { field: 'title', headerName: 'Title', width: 600 },
        { field: 'completed', headerName: 'Completed', width: 150 },
        { field: 'startDate', headerName: 'Start Date', width: 150 },
        { field: 'dueDateTimeFormatted', headerName: 'Due Date Time', width: 150 },
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
                    <Grid item xs={12}>
                        <InfiniteScroll
                            dataLength={rows.length}
                            next={fetchMoreData}
                            hasMore={hasNextPage}
                            loader={<h4>Loading...</h4>}
                        >
                            <DataGrid
                                rows={rows.map(row => ({ ...row, id: row.id }))}
                                columns={columns}
                                checkboxSelection
                                onRowClick={(rowParams) => setSelectedRow(rowParams.row)}
                                disableRowSelectionOnClick
                            />
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
