var accounting = require('accounting');
var requestKickstarterData = require('./requestKickstarterData')

module.exports = function(template, strechGoalIndex, settings) {
    return function handleStretchGoalRequest(req, res) {
        requestKickstarterData(settings.kickstarter, function renderStretchGoal(error, project) {
            if(error) {
                console.info(error);
                res.write(error.stack());
            } else {
                var strechGoal = settings.kickstarter.strechGoal[strechGoalIndex];
                var percent = project.pledged/strechGoal;
                
                if(percent > 1.0)
                    percent = 1.0;
                
                res.render(template, {
                    'pledged':                accounting.formatMoney(project.pledged, {precision:0, symbol:settings.kickstarter.currency}),
                    'percentToStrechGoal':    Math.round(100*percent),
                    'percentToStrechGoalCss': Math.round(145*percent),
                    'strechGoal':             accounting.formatMoney(strechGoal, {precision:0, symbol:settings.kickstarter.currency})
                });
            }
        });
    };
};