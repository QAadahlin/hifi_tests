var test = Script.require("./test.js");
test.test();

// Check every second if the test is complete
var testTimer = Script.setInterval(
    function() {
        if (test.complete) {
            Script.stop();
        }
    },

    1000
);
