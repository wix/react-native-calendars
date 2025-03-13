function getDate(date, firstDay, weekIndex, numberOfDays) {
    const d = new XDate(date);
    // get the first day of the week as date (for the on scroll mark)
    let dayOfTheWeek = d.getDay();
    if (dayOfTheWeek < firstDay && firstDay > 0) {
        dayOfTheWeek = 7 + dayOfTheWeek;
    }
    // Always adjust to the start of the week
    d.addDays(firstDay - dayOfTheWeek);
    // Add the appropriate number of weeks
    const newDate = numberOfDays && numberOfDays > 1 ? d.addDays(weekIndex * numberOfDays) : d.addWeeks(weekIndex);
    const today = new XDate();
    const offsetFromNow = newDate.diffDays(today);
    const isSameWeek = offsetFromNow > 0 && offsetFromNow < (numberOfDays ?? 7);
    return toMarkingFormat(isSameWeek ? today : newDate);
} 