import { useQuery } from '@apollo/client';
import { Card, CardContent, Checkbox, Grid, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';
import { useGlobalContext } from '../../App/GlobalContextProvider';
import { useState } from 'react';
import { getCurrentLocalDate } from '../../../components/DateFunctions';

// Queries
import { GET_ACCOUNTABILITIES, GET_ACCOUNTABILITY_DATA } from '../../../models/accountability';


interface AccountabilityToDoListDisplayProps {
}


const AccountabilityToDoListDisplay = (props: AccountabilityToDoListDisplayProps) => {
    const { globalProfile } = useGlobalContext();

    const [selectedSquad, setSelectedSquad] = useState<string>('None');

    // Get all accountabilities
    const { data, loading, error } = useQuery(GET_ACCOUNTABILITIES, {
        onError: (error) => {
            console.log(error.message)
        },
    })

    // Accountability data query
    const { data: accountabilityData } = useQuery(GET_ACCOUNTABILITY_DATA, {
        variables: { accountability: selectedSquad },
        skip: selectedSquad === 'None',
        onError: (error) => {
            console.log(error.message);
        },
        onCompleted: (data) => {
            console.log(data);
        }
    });

    const handleSquadChange = (event: SelectChangeEvent<string>) => {
        setSelectedSquad(event.target.value as string);
    };

    const today = getCurrentLocalDate()
    const todayTasksArray = accountabilityData?.monthlyCompletionPercentages.filter((record: { date: any; }) => record.date === today) || [];
    const sortedTodayTasksArray = todayTasksArray.sort((a: any, b: any) => {
        if (a.profile.codename === globalProfile.codename) return -1;
        if (b.profile.codename === globalProfile.codename) return 1;
        return 0;
    });



    if (loading) return <p>Loading...</p>
    if (error) return <p>Error :(</p>

    return (
        <Card sx={{ borderRadius: 2, boxShadow: 2, margin: 1, padding: 1, }}>
            <Grid item xs={12} md={12} order={{ xs: 3, md: 3 }} style={{ height: '100%', overflowY: 'auto' }}>
                <Card>
                    <CardContent>



                        <Typography variant="h5" gutterBottom>
                            Accountability
                        </Typography>
                        <Typography variant="h6" gutterBottom>
                            Select a Squad
                        </Typography>
                        <Select
                            value={selectedSquad}
                            onChange={handleSquadChange}
                        >
                            <MenuItem value="None">None</MenuItem>
                            {data.myAccountabilities.map((squad: { id: string, name: string }) => (
                                <MenuItem key={squad.id} value={squad.id}>
                                    {squad.name}
                                </MenuItem>
                            ))}
                        </Select>



                        {/* To do display */}
                        <div>
                            <Typography variant="h6" gutterBottom style={{ textAlign: "center", paddingTop: "20px" }}>
                                Today's Tasks
                            </Typography>

                            <Grid container spacing={3}>
                                {sortedTodayTasksArray.map((todayTasks: any) => {
                                    const parsedTasks = JSON.parse(todayTasks.tasksList);
                                    const sortedTasks = parsedTasks.sort((a: any, b: any) => (a.checked === b.checked ? 0 : a.checked ? 1 : -1));

                                    return (
                                        <Grid item xs={12} sm={6} key={todayTasks.profile.id}>
                                            <Card>
                                                <CardContent>
                                                    <Typography variant="subtitle1" style={{ paddingTop: "10px", fontWeight: "bold" }}>
                                                        {todayTasks.profile.codename}
                                                    </Typography>
                                                    <ul>
                                                        {sortedTasks.map((task: any, index: number) => (
                                                            <li key={index}>
                                                                <Checkbox
                                                                    checked={task.checked}
                                                                    inputProps={{ 'aria-label': 'controlled-checkbox' }}
                                                                    style={{ marginRight: "8px" }}
                                                                    disabled
                                                                />
                                                                {task.title}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    );
                                })}
                            </Grid>

                        </div>



                    </CardContent>
                </Card>
            </Grid>
        </Card>
    );
}

export default AccountabilityToDoListDisplay;
