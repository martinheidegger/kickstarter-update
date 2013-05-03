var kickstarter_update = require("./");
var accounting = require('accounting');
var app = require('express')();

var settings = require("./settings.json");

app.set('view engine', 'hbs');
app.get('/strechGoal1', function(req, res) {
    kickstarter_update.requestKickstarterData(settings.kickstarter, function (error, project) {
        if(error) {
            res.write(error);
        } else {
            var strechGoal = settings.kickstarter.strechGoal[0];
            var percent = project.pledged/strechGoal;
            
            if(percent > 1.0) percent = 1.0;
            
            res.render('strechGoal1', {
                'pledged':                accounting.formatMoney(project.pledged, {precision:0, symbol:settings.kickstarter.currency}),
                'percentToStrechGoal':    Math.round(100*percent),
                'percentToStrechGoalCss': Math.round(145*percent),
                'strechGoal':             accounting.formatMoney(strechGoal, {precision:0, symbol:settings.kickstarter.currency})
            });
        }
    })
});

app.get('/:any?.png', kickstarter_update.webshotRoute(settings.prefix, settings.webshot));

if(settings.pushToS3) {
    setInterval(kickstarter_update.webshotToS3({
        Bucket: settings.Bucket,
        prefix: settings.prefix,
        accessKeyId: settings.accessKeyId,
        secretAccessKey: settings.secretAccessKey,
        maxAgeInSeconds: settings.maxAgeInSeconds,
        webshot: settings.webshot
    }), settings.checkInterval);
}
app.listen(settings.port);
