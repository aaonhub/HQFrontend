import { useEffect } from 'react';
import { getCurrentLocalDate, currentLocalTime, addLengthToTime, getCurrentLocalDateUnadjusted } from '../../components/DateFunctions';
import { useQuery } from '@apollo/client';
import { useGlobalContext } from './GlobalContextProvider';

// Queries and Mutations
import { GET_DAILY_REVIEW_BY_DATE } from '../../models/dailyreview';
import { GET_HABITS_DUE_TODAY } from '../../models/habit';
import { GET_TO_DO_LIST_ITEMS_BY_START_DATE } from '../../models/inboxitem';
import { LAST_LOG_TIME } from '../../models/log';



// Today Badge
export function TodayBadge() {
    const { todayBadges, setTodayBadges } = useGlobalContext();

    const { data: habitsData } = useQuery(GET_HABITS_DUE_TODAY, {
        fetchPolicy: 'network-only',
        variables: {
            today: getCurrentLocalDate(),
        },
    });

    const { data: toDoListData } = useQuery(GET_TO_DO_LIST_ITEMS_BY_START_DATE, {
        fetchPolicy: 'network-only',
        variables: {
            Today: getCurrentLocalDate(),
        },
    });

    useEffect(() => {
        if (habitsData && toDoListData) {
            // go through habits and see how many are past their start time
            let currentEvents: any = 0;
            let pastDueEvents: any = 0;

            habitsData.habitsDueToday.forEach((habit: any) => {
                if (getCurrentLocalDate() < getCurrentLocalDateUnadjusted() && !habit.completedToday) {
                    pastDueEvents++;
                    console.log("1")
                    console.log(getCurrentLocalDate())
                    console.log(getCurrentLocalDateUnadjusted())
                } else
                    if (habit.schedule.timeOfDay < currentLocalTime() && !habit.completedToday) {
                        if (!habit.length) {
                            pastDueEvents++;
                            console.log("2")
                            console.log(habit.schedule.timeOfDay)
                            console.log(currentLocalTime())
                        } else {
                            if (addLengthToTime(habit.schedule.timeOfDay, habit.length) > currentLocalTime()) {
                                currentEvents++;
                            } else {
                                pastDueEvents++;
                                console.log("3")
                                console.log(addLengthToTime(habit.schedule.timeOfDay, habit.length))
                                console.log(currentLocalTime())
                            }
                        }

                    }
            });

            // go through to do list items and see how many are past their start time
            toDoListData.toDoItemsByStartDate.forEach((item: any) => {
                if (currentLocalTime() < getCurrentLocalDateUnadjusted() && !item.completed) {
                    pastDueEvents++;
                    console.log("4")
                    console.log(currentLocalTime())
                    console.log(getCurrentLocalDateUnadjusted())
                } else
                    if (item.startTime < currentLocalTime() && !item.completed) {
                        if (!item.length) {
                            pastDueEvents++;
                            console.log("5")
                            console.log(item.startTime)
                            console.log(currentLocalTime())
                        } else {
                            if (addLengthToTime(item.startTime, item.length) > currentLocalTime()) {
                                currentEvents++;
                            } else {
                                pastDueEvents++;
                                console.log("6")
                                console.log(addLengthToTime(item.startTime, item.length))
                                console.log(currentLocalTime())
                            }
                        }
                    }
            });

            if (currentEvents === 0) {
                currentEvents = false;
            }
            if (pastDueEvents === 0) {
                pastDueEvents = false;
            }

            setTodayBadges([currentEvents, pastDueEvents]);
        }
    }, [habitsData, toDoListData, setTodayBadges]);

    return todayBadges;

}


// Daily Review Badge
export function DailyReviewBadge() {
    const { dailyReviewBadges, setDailyReviewBadges } = useGlobalContext();

    const { data } = useQuery(GET_DAILY_REVIEW_BY_DATE, {
        fetchPolicy: 'network-only',
        variables: {
            date: getCurrentLocalDate(),
        },
    });

    useEffect(() => {
        if (data && data.dailyReviews.length === 0) {
            // if the current time is past 11:00am, then show the badge
            const now = new Date();
            const hours = now.getHours();
            const minutes = now.getMinutes();
            if (hours >= 21 && minutes >= 0) {
                setDailyReviewBadges([false, 1]);
            }
        } else {
            setDailyReviewBadges([false, false]);
        }
    }, [data, setDailyReviewBadges]);

    return dailyReviewBadges;
}

// Log Badge
export function LogBadge() {
    const { logBadges, setLogBadges } = useGlobalContext();

    const { data } = useQuery(LAST_LOG_TIME, {
        fetchPolicy: 'network-only',
        onCompleted: (data) => {
            if (isOverAnHourAgo(data.lastLogTime)) {
                setLogBadges([1, false]);
            }
        }
    });

    function isOverAnHourAgo(lastLogTime: string): boolean {
        if (!lastLogTime) {
            return true;
        }
        const truncatedLogTime = lastLogTime.slice(0, 23) + 'Z'; // Truncate microseconds to milliseconds
        const lastLogDate = new Date(truncatedLogTime);
        const currentDate = new Date();

        const differenceInMilliseconds = currentDate.getTime() - lastLogDate.getTime();
        const differenceInHours = differenceInMilliseconds / (1000 * 60 * 60);

        return differenceInHours > 1;
    }


    return logBadges;
}