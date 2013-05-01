var http = require('http');
var cheerio = require('cheerio');
var request = require('request');

module.exports = function(project, onComplete) {
    request("http://www.kickstarter.com/projects/"+project, function(error, response, body) {
        if(error) {
            onComplete(error, response);
        } else {
            var root = cheerio.load(body);
            var pledged = root('#pledged');
            var pledgedData = pledged.find('data');
            onComplete(null,{
                currency: pledgedData.attr('data-currency'),
                pledged: parseFloat(pledgedData.attr('data-value')),
                goal: parseFloat(pledged.attr('data-goal')),
                end: new Date(root('h5.ksr_page_timer').attr('data-end_time'))
            });
        }
    });
};