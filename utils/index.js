import moment from 'moment'
export const formatDate = (date, format = 'DD-MM-YYYY hh:mm:ss A') => {
    return moment(date).format(format)
}