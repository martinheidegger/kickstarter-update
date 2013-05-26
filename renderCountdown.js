var requestKickstarterData = require('./requestKickstarterData')

module.exports = function(template, end) {
    return function renderCountdownRequest(req, res) {
        var diff = (end.getTime()-Date.now()) / (1000*60)|0;
        var day = "00";
        var hour = "00";
        var minute = "00";
        if(diff > 0)
        {
            var oneHour = 60;
            var oneDay = oneHour*24;
            day = diff / oneDay |0;
            diff -= day * oneDay;
            day = day.toString();
            if(day.length < 2)
            {
                day = "0"+day;
            }
            hour = diff / oneHour |0;
            diff -= hour * oneHour;
            hour = hour.toString();
            if(hour.length < 2)
            {
                hour = "0"+hour;
            }
            minute = diff.toString();
            if(minute.length < 2)
            {
                minute = "0"+minute;
            }
        }
        
        res.render(template, {
            'day':    day,
            'hour':   hour,
            'minute': minute
        });
    }
};