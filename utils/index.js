import dayjs from 'dayjs';
export const formatDate = (date, format = 'DD-MM-YYYY hh:mm:ss A') => {
    return dayjs(date).format(format)
}