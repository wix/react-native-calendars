import isEmpty from 'lodash/isEmpty';
const today = new Date().toISOString().split('T')[0];
const pastDate = getPastDate(3);
const futureDates = getFutureDates(12);
const dates = [pastDate, today].concat(futureDates);
function getFutureDates(numberOfDays) {
    const array = [];
    for (let index = 1; index <= numberOfDays; index++) {
        let d = Date.now();
        if (index > 8) {
            // set dates on the next month
            const newMonth = new Date(d).getMonth() + 1;
            d = new Date(d).setMonth(newMonth);
        }
        const date = new Date(d + 864e5 * index); // 864e5 == 86400000 == 24*60*60*1000
        const dateString = date.toISOString().split('T')[0];
        array.push(dateString);
    }
    return array;
}
function getPastDate(numberOfDays) {
    return new Date(Date.now() - 864e5 * numberOfDays).toISOString().split('T')[0];
}
export const agendaItems = [
    {
        title: dates[0],
        data: [{ hour: '12am', duration: '1h', title: 'First Yoga' }, { hour: '9am', duration: '1h', title: 'Long Yoga', itemCustomHeightType: 'LongEvent' }]
    },
    {
        title: dates[1],
        data: [
            { hour: '4pm', duration: '1h', title: 'Pilates ABC' },
            { hour: '5pm', duration: '1h', title: 'Vinyasa Yoga' }
        ]
    },
    {
        title: dates[2],
        data: [
            { hour: '1pm', duration: '1h', title: 'Ashtanga Yoga' },
            { hour: '2pm', duration: '1h', title: 'Deep Stretches' },
            { hour: '3pm', duration: '1h', title: 'Private Yoga' }
        ]
    },
    {
        title: dates[3],
        data: [{ hour: '12am', duration: '1h', title: 'Ashtanga Yoga' }]
    },
    {
        title: dates[4],
        data: [{}]
    },
    {
        title: dates[5],
        data: [
            { hour: '9pm', duration: '1h', title: 'Middle Yoga' },
            { hour: '10pm', duration: '1h', title: 'Ashtanga' },
            { hour: '11pm', duration: '1h', title: 'TRX' },
            { hour: '12pm', duration: '1h', title: 'Running Group' }
        ]
    },
    {
        title: dates[6],
        data: [
            { hour: '12am', duration: '1h', title: 'Ashtanga Yoga' }
        ]
    },
    {
        title: dates[7],
        data: [{}]
    },
    {
        title: dates[8],
        data: [
            { hour: '9pm', duration: '1h', title: 'Pilates Reformer' },
            { hour: '10pm', duration: '1h', title: 'Ashtanga' },
            { hour: '11pm', duration: '1h', title: 'TRX' },
            { hour: '12pm', duration: '1h', title: 'Running Group' }
        ]
    },
    {
        title: dates[9],
        data: [
            { hour: '1pm', duration: '1h', title: 'Ashtanga Yoga' },
            { hour: '2pm', duration: '1h', title: 'Deep Stretches' },
            { hour: '3pm', duration: '1h', title: 'Private Yoga' }
        ]
    },
    {
        title: dates[10],
        data: [
            { hour: '12am', duration: '1h', title: 'Last Yoga' }
        ]
    },
    {
        title: dates[11],
        data: [
            { hour: '1pm', duration: '1h', title: 'Ashtanga Yoga' },
            { hour: '2pm', duration: '1h', title: 'Deep Stretches' },
            { hour: '3pm', duration: '1h', title: 'Private Yoga' }
        ]
    },
    {
        title: dates[12],
        data: [
            { hour: '12am', duration: '1h', title: 'Last Yoga' }
        ]
    },
    {
        title: dates[13],
        data: [
            { hour: '12am', duration: '1h', title: 'Last Yoga' }
        ]
    }
];
export function getMarkedDates() {
    const marked = {};
    agendaItems.forEach(item => {
        // NOTE: only mark dates with data
        if (item.data && item.data.length > 0 && !isEmpty(item.data[0])) {
            marked[item.title] = { marked: true };
        }
        else {
            marked[item.title] = { disabled: true };
        }
    });
    return marked;
}
