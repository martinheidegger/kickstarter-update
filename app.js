var kickstarter_update = require('./');
var app = require('express')();

var settings = require('./settings.json');

app.set('view engine',   'hbs');
app.get('/strechGoal1',  kickstarter_update.renderStretchGoal('strechGoal1', 0, settings));
app.get('/strechGoal1b', kickstarter_update.renderStretchGoal('strechGoal1b', 0, settings));
app.get('/countdown',    kickstarter_update.renderCountdown('countdown', new Date(settings.kickstarter.end)));
app.get('/:any?.png',    kickstarter_update.webshotRoute(settings.prefix, settings.webshot));

if(settings.pushToS3) {
    kickstarter_update.startWebshotToS3Interval(settings);
}
app.listen(settings.port);
