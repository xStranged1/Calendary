export function getFirstDates(dates) {
    let firstDate = dates[0]
    for (let i = 0; i < dates.length; i++) {
        const date = dates[i];
        if (firstDate > date) {
            firstDate = date
        }
    }
    return firstDate
}