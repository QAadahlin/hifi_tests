# Auto Tester

The auto-tester is a stand alone application that provides a mechanism for regression testing.  The general idea is simple:
* Each test folder has a script that produces a set of snapshots.
* The snapshots are compared to a 'canonical' set of images that have been produced beforehand.

***Please note that before running any test that the world must be empty and all scripts must have been stopped.***

A script named **deleteAllEntities.js** is provided in the **tests/utils** folder for that purpose.

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
An automatic test is always named **test.js**.  This file is a javascript module; meaning it cannot be directly run.
### runTest.js
To enable automatic execution of the test, another file is present that calls the module.  This file is named **runTest.js**.
### runTestStepByStep.js

An additional script is provided for single-stepping through the tests.  The space-bar is used for stepping, and the step number is printed to the console (CTRL+SHIFT+l).  This file is called **runTestStepByStep.js**.  This script does not record any information.
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
Auto-tester will create a script named **allTests.js** that will call all **test.js** scripts found in the folder, and any subfolders.
### Create a Test Case
A test case is created after running the test script.  Running the script produces a series of snapshots, named **hifi-snap-by-**_user name_**-on-YYYY-MM-DD_HH-MM-SS.jpg**.  This function simply renames these files to **ExpectedImage_1.jpg**, **ExpectedImage_2.jpg** and so on.  These files can be added to version control as they are a fixed asset of the test.
