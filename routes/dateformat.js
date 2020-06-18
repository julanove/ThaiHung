var moment = require('moment');

module.exports = function formatDate(datetime, format) {
    if (moment) {
        format = DateFormats[format] || format;
        return moment(datetime).format(format);
    }
    else {
        return datetime;
    }
}

var DateFormats = {
    short: "DD MMMM - YYYY",
    long: "dddd DD.MM.YYYY HH:mm"
};