var http = require('http');
var cheerio = require('cheerio');

module.exports = function(project, onComplete) {
    http.get("http://www.kickstarter.com/projects/"+project, function(res) {
        var allData = '';
        res.on('data', function(data) {
            allData += data;
        });
        res.on('end', function() {
            var root = cheerio.load(allData);
            var pledged = root('#pledged');
            var pledgedData = pledged.find('data');
            onComplete(null,{
                currency: pledgedData.attr('data-currency'),
                pledged: parseFloat(pledgedData.attr('data-value')),
                goal: parseFloat(pledged.attr('data-goal')),
                end: new Date(root('h5.ksr_page_timer').attr('data-end_time'))
            })
        });
    }).on('error', function() {
        onComplete(err, null);
    });
};