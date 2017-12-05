# Auto Tester

The auto-tester is a stand alone application that provides a mechanism for regression testing.  The general idea is simple:
* Each test folder has a script that produces a set of snapshots.
* The snapshots are compared to a 'canonical' set of images that have been produced beforehand.

***Please note that before running any test that the world must be empty and all scripts must have been stopped.***

A script named **deleteAllEntities.js** is provided in this folder for that purpose.

## Test File Content
An automatic test is always named **test.js**.  This file contains a javascript module, as described below.  To enable manual execution of the test, another file must be present that calls the module.  The contents of this file are fixed, and it is suggested to name it **runTest.js**.  The contents of the file are as follows:

```javascript
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

```

The **test.js** file itself has two requirements:
1. Export a parameterless function named test
2. Export a boolean named complete
    1. Initialized to false
    2. Set to true on completion of the test
    
    
A test expects an empty world and should end with an empty world, for the next test (if any).  The test should create a list of snapshots in the local folder.  The following code snippet describes one way of doing this.

```javascript
module.exports.complete = false;

module.exports.test = function() {
    // Look down Z axis 
    MyAvatar.bodyYaw = 0.0;
    MyAvatar.bodyPitch = 0.0;
    MyAvatar.bodyRoll = 0.0;
    MyAvatar.headYaw = 0.0;
    MyAvatar.headPitch = 0.0;
    MyAvatar.headRoll = 0.0;

    // Add some entities...

    // Setup snapshots
    //    resolvePath(".") returns a string that looks like <path to High Fidelity resource folder> + "file:/" + <current folder>
    //    We need the current folder
    var combinedPath = Script.resolvePath(".");
    var path = combinedPath.substring(combinedPath.indexOf(":") + 4);
    Snapshot.setSnapshotsLocation(path);

    // Note that the image for the current step is snapped at the beginning of the next step.
    // This is because it may take a while for the image to stabilize.
    var STEP_TIME = 2000;
    var step = 1;
    Script.setTimeout(
      function() {
        // Give user time to move mouse cursor out of window
      }, 
        
      step * STEP_TIME
    );

    step += 1;
    Script.setTimeout(
        function() {
            Window.takeSnapshot();

            // Do something
        }, 
          
        step * STEP_TIME
    );

    step += 1;
    Script.setTimeout(
        function() {
            Window.takeSnapshot();

            // Do something else
        }, 
          
        step * STEP_TIME
    );

    step += 1;
    Script.setTimeout(
        function() {
            Window.takeSnapshot();

            // Do the last thing
        }, 
          
        step * STEP_TIME
      );
      
    // Take final snapshot
    step += 1;
    Script.setTimeout(
      function () {
          Window.takeSnapshot();
      },
      
      step * STEP_TIME
    );
      
    // Clean up after test
    step += 1;
    Script.setTimeout(
      function () {
          // delete entities and any other cleanup
          
          module.exports.complete = true;
      },
      
      step * STEP_TIME
    );
}

```
## Using the auto-tester
The auto-tester provides the following 4 functions:
1. Evaluate a single test
2. Evaluate tests recursively
3. Create a recursive test script
4. Create a test case

![](./autoTesterUI.png)

Each of the 4 functions asks the user to select a folder.

### Evaluate Test
Evaluating a test is performed after running a **test.js** script to create new snapshots.  After selecting the folder, the images are compared in lexical order.  If the similarity between any image pair does not pass a fixed threshold, the image pair is displayed and the user can select to accept the difference, fail this specific test case, or abort testing.
![](./autoTesterMismatchExample.png)
### Evaluate Tests Recursively
This is a recursive version of the previous function.  Auto-tester will recurse through all folders from the selected folder.  A test will be evaluated if the following is true:
* The folder contains a **test.js** script
* The number of actual and expected snapshots is the same (see Create Test for an explanation)
## Create a recursive test script
Auto-tester will create a script named **allTests.js** that will call all **test.js** scripts found in the folder, and any subfolders.  An example of the script created is:
```
// This is an automatically generated file, created by auto-tester
var test1 = Script.require("file:///D:/GitHub/hifi-tests/tests/content/entity/zone/ambientLightInheritance/test.js");
var test2 = Script.require("file:///D:/GitHub/hifi-tests/tests/content/entity/zone/create/test.js");
var test3 = Script.require("file:///D:/GitHub/hifi-tests/tests/content/entity/zone/createMultipleZones/test.js");

var test1HasNotStarted = true;
var test2HasNotStarted = true;
var test3HasNotStarted = true;

// Check every second if the current test is complete and the next test can be run
var testTimer = Script.setInterval(
    function() {
        if (test1HasNotStarted) {
            test1HasNotStarted = false;
            test1.test();
            print("******started test 1******");
        }

        if (test1.complete && test2HasNotStarted) {
            test2HasNotStarted = false;
            test2.test();
            print("******started test 2******");
        }

        if (test2.complete && test3HasNotStarted) {
            test3HasNotStarted = false;
            test3.test();
            print("******started test 3******");
        }

        if (test3.complete) {
            print("******stopping******");
            Script.stop();
        }

    },

    1000
);

// Stop the timer and clear the module cache
Script.scriptEnding.connect(
    function() {
        Script.clearInterval(testTimer);
        Script.require.cache = {};
    }
);
```
### Create a Test Case
A test case is created after running the test script.  Running the script produces a series of snapshots, named **hifi-snap-by_**_user name_**-on-YYYY-MM-DD_HH-MM-SS.jpg**.  This function simply renames these files to **ExpectedImage_1.jpg**, **ExpectedImage_2.jpg** and so on.  These files can be added to version control as they are a fixed asset of the test.
