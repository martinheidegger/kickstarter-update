var kickstarter_update = require("./");

var app = require('express')();
var port = 3000;
app.set('view engine', 'hbs');
app.get('/index', function(req, res){
    kickstarter_update.requestKickstarterData("attanasio/butoh-space-dance", function(error,data) {
        res.render('index', data);
    })
});

app.get('/:any?.shot', kickstarter_update.webshotRoute("http://localhost:"+port+"/", {
        index: {
            screenSize: {
                width: 200,
                height: 200
            }
        }
}));

app.listen(port);