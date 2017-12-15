# Auto Tester

The auto-tester is a stand alone application that provides a mechanism for regression testing.  The general idea is simple:
* Each test folder has a script that produces a set of snapshots.
* The snapshots are compared to a 'canonical' set of images that have been produced beforehand.

***Please note that before running any test that the world must be empty and all scripts must have been stopped.***

A script named **deleteAllEntities.js** is provided in the **tests/utils** folder for that purpose.

##autoTester.js
Another script in the **tests/utils** folder is **autoTester.js**.

This script is a module that exposes two functions.
### setupSnapshots.js
This function hides the avatar, sets its orientation to 0, sets the snapshots folder and sets up the secondary camera.  The secondary camera is used to take snapshots so that the snapshot size will be independent of the user's monitor.
### addStep
This function adds a step to the test and accepts 3 parameters:
1.  boolean defining whether or not to take a snapshot at the beginning of the test (i.e. - the result of the _previous step_).
2.  a function defining the step itself
3.  the step time.  This time is multiplied by the step number to set the timeout.  It is suggested that this is fixed at a value like 2000 (in millseconds), so each step will run after another 2 seconds.

## Setup
### Windows 10
* Clone the hifi_tests repository
```
git clone https://github.com/NissimHadar/hifi_tests.git
```
* Double click **setup.bat** to download and install autotester (Note: do not select setup.ps1 by mistake). When prompted, select folder to install autoTester (the default is usually OK).
* ![](./setup_7z.png)

The executable is located in the **autoTester/Release** folder, and is named **autoTester.exe**.
This will also download content for the tests, located in **autoTester/Resources**.

## Test File Content
### test.js
An automatic test is always named **test.js**.  This file contains a javascript module, as described below.  
#### test.js details
The **test.js** file itself has two requirements:
1. Export a parameterless function named `test`
2. Export a boolean named`complete`
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
    var camera = autoTester.setupSnapshots(Script.resolvePath("."));
    var spectatorCameraConfig = Render.getConfig("SecondaryCamera");

    // Note that the image for the current step is snapped at the beginning of the next step.
    // This is because it may take a while for the image to stabilize.
    var STEP_TIME = 2000;
        
    // An array of tests is created.  These may be called via the timing mechanism for auto-testing,
    // or stepped through with the space bar
    var steps = [
        // Turn on haze and set range to 15K and 
        function () {
            var newProperty = { 
                hazeMode: "enabled",
                haze: {
                    hazeRange: 15000.0
                }
            };
            Entities.editEntity(sky, newProperty);  

        },
        
        // Set range to 8K and 
        function () {
            var newProperty = { 
                haze: {
                    hazeRange: 8000.0
                }
            };
            Entities.editEntity(sky, newProperty);  

        }
    ]
    
    var i = 0;
    if (testType  == "auto") {
        autoTester.addStep(false, steps[i++], STEP_TIME);
        autoTester.addStep(true, steps[i++], STEP_TIME);
     } else {
        Controller.keyPressEvent.connect(
            function(event){
                if (event.key == 32) {
                    print("Running step " + (i + 1));
                    steps[i++]();
                    i = Math.min(i, steps.length-1);
                }
            }
        );
    }
};
```
### runTest.js
To enable automatic execution of a test, another file must be present that calls the module.  The contents of this file are fixed, and it is suggested to name it **runTest.js**.  The contents of the file are as follows:

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
### runTestStepByStep.js

An additional script is provided for single-stepping through the tests.  The space-bar is used for stepping, and the step number is printed to the console (CTRL+SHIFT+l).  This file is called **runTestStepByStep.js** and its contents are as follows:
```
var test = Script.require("./test.js");
test.test("step by step");
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
### Create a recursive test script
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
A test case is created after running the test script.  Running the script produces a series of snapshots, named **hifi-snap-by-**_user name_**-on-YYYY-MM-DD_HH-MM-SS.jpg**.  This function simply renames these files to **ExpectedImage_1.jpg**, **ExpectedImage_2.jpg** and so on.  These files can be added to version control as they are a fixed asset of the test.
