var kickstarter_update = require("./");
var accounting = require('accounting');

var app = require('express')();
var port = 80;
var strechGoal = 250000.0;

app.set('view engine', 'hbs');

app.get('/index', function(req, res){

    // Set the opts to pass to requestKickstarterData
    var opts = { 
                 creator: 'johnonolan',
                 project: 'ghost-just-a-blogging-platform'
                };

    kickstarter_update.requestKickstarterData( opts, function (error, project) {
        if(error) {
            res.write(error);
        } else {
            var percent = project.pledged/strechGoal;
            
            if(percent > 1.0) percent = 1.0;
            
            res.render('index', {
                'pledged':                accounting.formatMoney(project.pledged, {symbol:"£"/* data.currency is GBP :-p */}),
                'percentToStrechGoal':    Math.round(100*percent),
                'percentToStrechGoalCss': Math.round(145*percent),
                'strechGoal':             accounting.formatMoney(strechGoal, {symbol:"£"})
            });
        }
    })
});

app.get('/:any?.png', kickstarter_update.webshotRoute("http://localhost:"+port+"/", {
    index: {
        screenSize: {
            width: 620,
            height: 245
        }
    }
}));

app.listen(port);
