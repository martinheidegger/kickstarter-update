var AWS = require('aws-sdk');
var webshot = require('webshot');

function createView(Key, opts, s3, onComplete) {
    var url = opts.prefix+Key;
    var webshotSettings = opts.webshot;
    webshot(url, webshotSettings, function(err, renderStream) {
        if(err) {
            console.error(err);
            onComplete(err, renderStream);
        } else {
            var imageParts = [];
            var hasError = false;
            renderStream.on('data', function(data) {
                imageParts.push(data);
            });
            renderStream.on('error', function(error) {
                onComplete(error);
                hasError = true;
            });
            renderStream.on('end', function() {
                if(!hasError)
                {
                    s3.putObject({Bucket:opts.Bucket, Key:Key, Body:Buffer.concat(imageParts), CacheControl:'max-age='+webshotSettings.maxAgeInSeconds+', public', StorageClass: "REDUCED_REDUNDANCY", ContentType: 'image/png', ACL:'public-read'}, function(err, data) {
                        if(err) {
                            console.error(err);
                        } else {
                            console.info("Updated webshot of "+Key);
                        }
                        onComplete(err, data);
                    });
                }
            });
        }
    });
}

function updateView(view, opts, s3, busy) {
    var Key = view+".png";
    if(!busy[view]) {
        busy[view] = true;
        s3.headObject({Bucket: opts.Bucket, Key: Key}, function(err, header){
            if(err) {
                if(err.code == 'NotFound') {
                    createView(Key, opts, s3, function(){
                        busy[view] = false;
                    });
                } else {
                    console.error("Error: ", err.stack);
                }
            } else {
                var now = Date.now();
                var lastModified = new Date(header.LastModified).getTime();
                var secondsSince = ((now - lastModified) / 1000) | 0;
                if(secondsSince > opts.webshot.maxAgeInSeconds) {
                    createView(Key, opts, s3, function(){
                        busy[view] = false;
                    });
                } else {
                    if(false) {
                        console.info('No need to update '+view+', the s3 version was last modified '+secondsSince+'s ago. (max: '+opts.webshot.maxAgeInSeconds+'s)');
                    }
                    busy[view] = false;
                }
            }
        });
    }
}

module.exports = function(opts) {
    var s3 = new AWS.S3({
        credentials: new AWS.Credentials(opts.accessKeyId, opts.secretAccessKey)
    });
    var busy = {};
    return function() {
        updateView(opts.view, opts, s3, busy);
    }
}