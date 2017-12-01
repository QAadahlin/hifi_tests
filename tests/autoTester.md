# Auto Tester

The auto-tester is a stand alone application that provides a mechanism for regression testing.  The general idea is simple:
* Each test folder has a script that produces a set of snapshots.
* The snapshots are compared to a 'canonical' set of images that have been produced beforehand.

## Test File Content
An automatic test is always named **test.js**.  This file contains a javascript module, as described below.  To enable manual execution of the test, another file must be present that calls the module.  The contents of this file are fixed, and it is suggested to name it **runTest.js**.  The contents of the file are a single line:

```javascript
Script.require("./test.js").test();
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
