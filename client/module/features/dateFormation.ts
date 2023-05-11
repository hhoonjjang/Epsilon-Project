const dateFormat = (rowDate: number) => {
    console.log(rowDate, '난 날것의 데이터임');
    const date = new Date(rowDate * 1000);
    console.log(date, '난 바꿔준 데이터임');
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();

    month = month >= 10 ? month : 0 + month;
    day = day >= 10 ? day : 0 + day;
    hour = hour >= 10 ? hour : 0 + hour;
    minute = minute >= 10 ? minute : 0 + minute;
    second = second >= 10 ? second : 0 + second;

    return date.getFullYear() + '-' + month + '-' + day;
};
export default dateFormat;
