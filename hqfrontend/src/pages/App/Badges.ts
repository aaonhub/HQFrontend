import { useEffect, useState } from 'react';
import { getCurrentLocalDate } from '../../components/DateFunctions';
import { useQuery } from '@apollo/client';
import { useGlobalContext } from './GlobalContextProvider';

import { GET_DAILY_REVIEW_BY_DATE } from '../../models/dailyreview';


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
    }, [data]);

    return dailyReviewBadgeCount;
}




