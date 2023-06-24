import React, { useRef, useEffect, useCallback, useState } from 'react';
import { Typography } from '@mui/material';
import { useQuery } from '@apollo/client';
import { TO_DO_ITEM_PAGINATION } from '../../models/inboxitem';
// import InfiniteScroll from 'react-infinite-scroll-component';

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
    const tableContainerRef = useRef<HTMLDivElement>(null);
    const [globalFilter, setGlobalFilter] = useState<string>();
    const [rows, setRows] = useState<Node[]>([]);

    const { loading, error, data, fetchMore } = useQuery(TO_DO_ITEM_PAGINATION, {
        variables: {
            completed: false,
            orderBy: 'title',
            title_Icontains: '',
        },
        onCompleted: (data) => {
            console.log(data.toDoItemsCount);
        }
    });

    const totalDBRowCount = data?.toDoItemsCount ?? 0;
    const totalFetched = rows.length;



    // Fetch more
    const fetchMoreOnBottomReached = useCallback(() => {
        if (!loading && totalFetched < totalDBRowCount) {
            fetchMore({
                variables: {
                    after: data.toDoItems.pageInfo.endCursor,
                },
            }).then(fetchMoreResult => {
                const newRows = fetchMoreResult.data.toDoItems.edges.map((edge: Edge) => edge.node);
                console.log(newRows)
                setRows(oldRows => [...oldRows, ...newRows]);
            });
        }
    }, [fetchMore, loading, totalFetched, totalDBRowCount, data]);




    useEffect(() => {
        const handleScroll = (event: any) => {
            const { scrollTop, scrollHeight, clientHeight } = event.target;
            if (scrollHeight - scrollTop === clientHeight) {
                fetchMoreOnBottomReached();
            }
        };

        const containerElement = tableContainerRef.current;
        if (containerElement) {
            containerElement.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (containerElement) {
                containerElement.removeEventListener('scroll', handleScroll);
            }
        };
    }, [fetchMoreOnBottomReached]);

    useEffect(() => {
        if (data?.toDoItems.edges.length) {
            const newRows = data.toDoItems.edges.map((edge: Edge) => edge.node);
            setRows(oldRows => [...oldRows, ...newRows]);
        }
    }, [data]);

    return (
        <div ref={tableContainerRef} style={{ height: '100vh', overflow: 'auto' }}>
            <Typography variant="h4">ToDos</Typography>
        </div>
    );
};

export default ToDosPage;
