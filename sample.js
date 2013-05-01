var kickstarter_update = require("./");
var accounting = require('accounting');

var app = require('express')();
var port = 3000;
var strechGoal = 250000.0;
app.set('view engine', 'hbs');
app.get('/index', function(req, res){
    kickstarter_update.requestKickstarterData("johnonolan/ghost-just-a-blogging-platform", function(error,data) {
        var percent = data.pledged/strechGoal;
        if(percent > 1.0) percent = 1.0;
        res.render('index', {
            'pledged':                accounting.formatMoney(data.pledged,    {symbol:"£"/* data.currency is GBP :-p */}),
            'percentToStrechGoal':    Math.round(100*percent),
            'percentToStrechGoalCss': Math.round(145*percent),
            'strechGoal':             accounting.formatMoney(strechGoal, {symbol:"£"})
        });
    })
});

app.get('/:any?.shot', kickstarter_update.webshotRoute("http://localhost:"+port+"/", {
    index: {
        screenSize: {
            width: 620,
            height: 245
        }
    }
}));

app.listen(port);