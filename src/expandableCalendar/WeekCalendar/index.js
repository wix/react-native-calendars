function getDate(date, firstDay, weekIndex, numberOfDays) {
    const d = new XDate(date);
    // get the first day of the week as date (for the on scroll mark)
    let dayOfTheWeek = d.getDay();
    if (dayOfTheWeek < firstDay && firstDay > 0) {
        dayOfTheWeek = 7 + dayOfTheWeek;
    }
    // Adjust to the start of the week
    d.addDays(firstDay - dayOfTheWeek);
    // Add the appropriate number of weeks
    const newDate = numberOfDays && numberOfDays > 1 ? d.addDays(weekIndex * numberOfDays) : d.addWeeks(weekIndex);
    return toMarkingFormat(newDate);
} 