var $ = require('jQuery');
module.exports = function(project, onComplete) {
    $.ajax({
        url: "http://www.kickstarter.com/projects/"+project,
        success: function(html) {
            var root = $(html);
            var pledged = root.find('#pledged');
            var pledgedData = pledged.find('data');
            onComplete(null,{
                currency: pledgedData.data('currency'),
                pledged: parseFloat(pledgedData.data('value')),
                goal: parseFloat(pledged.data('goal')),
                end: new Date(root.find('h5.ksr_page_timer').data('end_time'))
            })
        }
    });
};