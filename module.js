var webshot = require('webshot');
var express = require('express');
var $ = require('jQuery');
var fs = require('fs');
var path = require('path');

module.exports = function(options)
{
    var app = express();
    var data = {
        currency:"",
        pledged:0,
        goal: 0,
        end: new Date()
    };

    var webshotOptions = options.webshotOptions || {};
    app.set('view engine', 'hbs');
    app.get('/:any?', function(req, res) {
        var pth = req.params.any || "index";
        var ext = path.extname(pth);
        if(ext == ".shot") {
            var template = pth.substring(0,pth.length-ext.length);
            var url = "http://localhost:"+options.port+"/"+template;
            var myoptions = webshotOptions[template] || webshotOptions['default'] || webshotOptions;
            console.info("Myoptions", myoptions);
            webshot(url, myoptions, function(err, renderStream) {
                res.type(myoptions.type || 'png');
                var data = renderStream.toString('binary');
                renderStream.on('data', function(data) {
                    res.write(data.toString('binary'), 'binary');
                });
                renderStream.on('end', function(){
                    res.end();
                });
            })
        } else {
            res.render(pth, data);
        }
    });

    app.listen(options.port);

    var updateData = function(next) {
        $.ajax({
            url: "http://www.kickstarter.com/projects/"+options.project,
            success: function(html) {
                var root = $(html);
                var pledged = root.find('#pledged');
                var pledgedData = pledged.find('data');
                data.currency = pledgedData.data('currency');
                data.pledged = parseFloat(pledgedData.data('value'));
                data.goal = parseFloat(pledged.data('goal'));
                data.end = new Date(root.find('h5.ksr_page_timer').data('end_time'));
                next();
            }
        });
    };

    setInterval(function() {
        updateData(function() {
            var time = new Date();
            var file = fs.createWriteStream(options.file, {encoding: 'binary'});
            ;
        });
    }, options.screenShotInterval);

    return {
        close: function() {
            app.close();
        }
    }
};