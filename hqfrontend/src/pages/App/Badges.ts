import { useEffect } from 'react';
import { getCurrentLocalDate, currentLocalTime } from '../../components/DateFunctions';
import { useQuery } from '@apollo/client';
import { useGlobalContext } from './GlobalContextProvider';

// Queries and Mutations
import { GET_DAILY_REVIEW_BY_DATE } from '../../models/dailyreview';
import { GET_HABITS_DUE_TODAY } from '../../models/habit';
import { GET_TO_DO_LIST_ITEMS_BY_START_DATE } from '../../models/inboxitem';



// Today Badge
export function TodayBadge() {
    const { todayBadgeCount, setTodayBadgeCount } = useGlobalContext();

    const { data } = useQuery(GET_HABITS_DUE_TODAY, {
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
        onCompleted: (data) => {
            console.log(data);
        }
    });

    console.log(data, toDoListData);

    useEffect(() => {
        if (data && toDoListData) {
            // go through habits and see how many are past their start time
            let count = 0;
            data.habitsDueToday.forEach((habit: any) => {
                if (habit.timeOfDay < currentLocalTime()) {
                    count++;
                }
            });

            // go through to do list items and see how many are past their start time
            toDoListData.toDoItemsByStartDate.forEach((item: any) => {
                if (item.startTime < currentLocalTime()) {
                    count++;
                }
            });

            setTodayBadgeCount(count);
        }
    }, [data, setTodayBadgeCount, toDoListData]);

    return todayBadgeCount;

}


// Daily Review Badge
export function DailyReviewBadge() {
    const { dailyReviewBadgeCount, setDailyReviewBadgeCount } = useGlobalContext();

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
                setDailyReviewBadgeCount(1);
            }
            console.log(hours, minutes)
        } else {
            setDailyReviewBadgeCount(false);
        }
    }, [data, setDailyReviewBadgeCount]);

    return dailyReviewBadgeCount;
}


