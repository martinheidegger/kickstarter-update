var webshotToS3 = require('./webshotToS3');

module.exports = function(settings) {
    for(var view in settings.webshot) {
        var webshot = settings.webshot[view];
        setInterval(webshotToS3({
            Bucket: settings.Bucket,
            prefix: settings.prefix,
            accessKeyId: settings.accessKeyId,
            secretAccessKey: settings.secretAccessKey,
            view: view,
            webshot: webshot
        }), webshot.checkInterval);
    }
}