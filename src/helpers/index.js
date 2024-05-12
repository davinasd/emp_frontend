export const convertDateFormatString = (date) => {
    date = `${date}`;
    const dateArr = date.split(" ");
    return dateArr[2] + " " + dateArr[1] + " " + dateArr[3];
}

export const converDateStringFormat = (date) => {
    const dateArr = date.split(" ");
    return dateArr[1] + " " + dateArr[0] + " " + dateArr[2];
}

export const allMonths = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export const quarter1 = [
    'Apr', 'May', 'Jun'
];

export const quarter2 = [
    'Jul', 'Aug', 'Sep'
];

export const quarter3 = [
    'Oct', 'Nov', 'Dec'
];

export const quarter4 = [
    'Jan', 'Feb', 'Mar'
];

export const priorityArray = ["low", "medium", "high", "urgent"];