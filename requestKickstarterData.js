var http = require('http');
var request = require('request');

module.exports = function(opts, onComplete) {
    // Request the project
    request(opts.url+"/stats.json", 
            function(error, response, data) {
                if(error) {
                    onComplete(error, response);
                } else {
                    // #ugly : check if json.parse worked before passing on (could be lethal!)
                    onComplete(null, JSON.parse(data).project);
                }
            });
};