var init = require("./module.js");
var $ = require('jQuery');
init({
    project: "attanasio/butoh-space-dance",
    port: 3000,
    file: "data.png",
    screenShotInterval: 3000,
    webshotOptions: {
        index: {
            screenSize: {
                width: 200,
                height: 200
            }
        }
    },
    callback: function(newFile) {
        console.info(newFile);
    }
});
