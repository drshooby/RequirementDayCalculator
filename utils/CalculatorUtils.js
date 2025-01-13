import dayjs from 'dayjs';

const quarterEndDates = [
    "03-31",
    "06-30",
    "09-30",
    "12-31"
];


const getMonthEndDates = (year) => { 
    return [
        "01-31",
        dayjs(`${year}-02-29`).isValid() ? "02-29" : "02-28",
        "03-31",
        "04-30",
        "05-31",
        "06-30",
        "07-31",
        "08-31",
        "09-30",
        "10-31",
        "11-30",
        "12-31"
    ]
}

const dateTypes = {
    "quarter": quarterEndDates,
    "month": getMonthEndDates,
    "year": []
};

function getFormattedDates(calendarType, year, yearEndDate = null) {
    let dates = typeof dateTypes[calendarType] === 'function'
        ? dateTypes[calendarType](year)
        : dateTypes[calendarType];

    if (calendarType === "year" && yearEndDate) {
        yearEndDate = dayjs(yearEndDate).format('MM-DD');
        dates = [...dates, yearEndDate];
    }

    const r =  [
        ...dates.map(d => dayjs(`${year}-${d}`).startOf('day')),
        ...dates.map(d => dayjs(`${year - 1}-${d}`).startOf('day'))
    ];

    return r
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

function forceDateForward(calendarType, currDate, yearEndDate = null) {
    const formattedDates = getFormattedDates(calendarType, currDate.year(), yearEndDate);
    for (let i = 0; i < formattedDates.length; i++) {
        if (currDate.isBefore(formattedDates[i])) {
            return formattedDates[i];
        }
    }
    return formattedDates[0].add(1, 'year');
}

function getClosestEndDate(calendarType, startDate, yearEndDate = null) {
    let maxDiff = Infinity;
    let closestDate = null;
    let closestIdx = -1;
    const formattedDates = getFormattedDates(calendarType, startDate.year(), yearEndDate);

    for (let i = 0; i < formattedDates.length; i++) {
        const diff = Math.abs(startDate.diff(formattedDates[i], 'days'));
        const currDate = formattedDates[i];
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

function updateDate(calendarType, requirementDays, calendarDate, date, dateIdx, yearEndDate = null) {
    let formattedDates = getFormattedDates(calendarType, date.year(), yearEndDate);
    if (dateIdx + 1 === formattedDates.length) {
        if (calendarDate.year() === date.year()) {
            dateIdx = 0;
            formattedDates = getFormattedDates(calendarType, date.year() + 1, yearEndDate);
        } else {
            dateIdx = 0;
        }
    } else {
        dateIdx++;
    }
    return addDays(formattedDates[dateIdx], requirementDays);
}

function getNextDate(calendarType, startDate, requirementDays, yearEndDate = null) {
    let { date: calendarDate, idx } = getClosestEndDate(calendarType, startDate, yearEndDate);
    const reqDate = addDays(calendarDate, requirementDays);
    if (isDateBefore(reqDate, startDate)) {
        return updateDate(calendarType, requirementDays, calendarDate, reqDate, idx, yearEndDate);
    }
    return reqDate;
}

export function generateDates(calendarType, startDate, endDate, requirementDays, yearEndDate = null) {
    startDate = dayjs(startDate).startOf('day');
    endDate = dayjs(endDate).startOf('day');
    
    if (requirementDays <= 0) {
        return [];
    }

    const requirements = [];
    while (isDateBefore(startDate, endDate)) {
        const nextDate = getNextDate(calendarType, startDate, requirementDays, yearEndDate);
        if (isDateAfter(nextDate, endDate)) {
            break;
        }
        requirements.push(nextDate);
        startDate = forceDateForward(calendarType, nextDate, yearEndDate);
    }

    return requirements;
}