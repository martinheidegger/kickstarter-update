var webshot = require('webshot');

module.exports = function(prefix, webshotOptions) {
    return function(req, res) {
        var template = req.params.any || "";
        var url = prefix+template;
        var myoptions = webshotOptions[template] || webshotOptions['default'] || webshotOptions;
        webshot(url, myoptions, function(err, renderStream) {
            res.type(myoptions.type || 'png');
            renderStream.on('data', function(data) {
                res.write(data.toString('binary'), 'binary');
            });
            renderStream.on('end', function(){
                res.end();
            });
        });
    }
}