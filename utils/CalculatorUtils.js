import dayjs from 'dayjs';

const quarterEndDates = [
    "03-31",
    "06-30",
    "09-30",
    "12-31"
];

const dateTypes = {
    "quarter": quarterEndDates
};

function getFormattedDates(calendarType, year) {
    return [
        ...dateTypes[calendarType].map(d => dayjs(`${year}-${d}`).startOf('day')),
        ...dateTypes[calendarType].map(d => dayjs(`${year - 1}-${d}`).startOf('day'))
    ];
}

function addDays(day, numDays) {
    return day.add(numDays, 'days');
}

function isDateBefore(day1, day2) {
    return day1.isBefore(day2);
}

function isDateAfter(day1, day2) {
    return day1.isAfter(day2);
}

function forceDateForward(calendarType, currDate) {
    const formattedDates = getFormattedDates(calendarType, currDate.year());
    for (let i = 0; i < formattedDates.length; i++) {
        if (currDate.isBefore(formattedDates[i])) {
            return formattedDates[i];
        }
    }
    return formattedDates[0].add(1, 'year');
}

function getClosestEndDate(calendarType, startDate) {

    let maxDiff = Infinity
    let closestDate = null
    let closestIdx = -1

    const formattedDates = getFormattedDates(calendarType, startDate.year());

    for (let i = 0; i < formattedDates.length; i++) {
        const diff = Math.abs(startDate.diff(formattedDates[i], 'days'));
        const currDate = formattedDates[i]

        if (diff === 0) {
            return { date: currDate, idx: i };
        }

        if (diff < maxDiff) {
            maxDiff = diff;
            closestDate = currDate;
            closestIdx = i;
        }
    }
    return { date: closestDate, idx: closestIdx };
}

function updateDate(calendarType, requirementDays, calendarDate, date, dateIdx) {
    let formattedDates = getFormattedDates(calendarType, date.year());
    if (dateIdx + 1 === formattedDates.length) {
        if (calendarDate.year() === date.year()) {
            console.log('reset to next year');
            dateIdx = 0;
            formattedDates = getFormattedDates(calendarType, date.year() + 1);
        } else {
            dateIdx = 0;
        }
    } else {
        dateIdx++;
    }

    return addDays(formattedDates[dateIdx], requirementDays);
}

function getNextDate(calendarType, startDate, requirementDays) {
    let { date: calendarDate, idx } = getClosestEndDate(calendarType, startDate);
    const reqDate = addDays(calendarDate, requirementDays);
    if (isDateBefore(reqDate, startDate)) {
        return updateDate(calendarType, requirementDays, calendarDate, reqDate, idx)
    }
    return reqDate;
}

export function generateDates(calendarType, startDate, endDate, requirementDays) {
    startDate = dayjs(startDate).startOf('day');
    endDate = dayjs(endDate).startOf('day');
    
    if (requirementDays <= 0) {
        return [];
    }

    const requirements = []
    while (isDateBefore(startDate, endDate)) {
        const nextDate = getNextDate(calendarType, startDate, requirementDays);
        console.log(nextDate)
        if (isDateAfter(nextDate, endDate)) {
            break;
        }
        requirements.push(nextDate)
        startDate = forceDateForward(calendarType, nextDate);
    }

    return requirements;
}