module.exports.complete = false;

module.exports.test = function(testType) {
    // Find the root of the test tree.  The root contains the 'utils' folder
    var combinedPath = Script.resolvePath(".");
    var parts = combinedPath.split("/");
    
    // note that the current folder is one before last in 'parts'
    var testsRootHeight = 0;
    for (var i = parts.length - 2; i >= 0; --i) {
        if (parts[i] === 'tests') {
            testsRootHeight = parts.length - 2 - i;
            break;
        }
    }
    
    var prefix = "";
    for (var i = 0; i < testsRootHeight; ++i) {
        prefix += "../";
    }

    // Setup snapshots
    var autoTester = Script.require(prefix + "utils/autoTester.js");
    var camera = autoTester.setupSnapshots(combinedPath);
    var spectatorCameraConfig = Render.getConfig("SecondaryCamera");
        
    var avatarOriginPosition = MyAvatar.position;

    var zone1Position = { x: avatarOriginPosition.x, y: avatarOriginPosition.y + 0.01, z: avatarOriginPosition.z + 0.0};
    var zone2Position = { x: avatarOriginPosition.x, y: avatarOriginPosition.y + 0.02, z: avatarOriginPosition.z + 8.0};
    var zone3Position = { x: avatarOriginPosition.x, y: avatarOriginPosition.y + 0.03, z: avatarOriginPosition.z + 0.0};
    var zone4Position = { x: avatarOriginPosition.x, y: avatarOriginPosition.y + 0.04, z: avatarOriginPosition.z + 0.0};

    var zone1Dimensions = { x: 20.0, y: 10.0, z: 40.0};
    var zone2Dimensions = { x: 30.0, y: 10.0, z: 20.0};
    var zone3Dimensions = { x: 10.0, y: 10.0, z: 30.0};
    var zone4Dimensions = { x:  6.0, y: 10.0, z: 20.0};

    // Create zones
    var zone1properties = {
        type: "Zone",
        name: "zone 1",
        position: zone1Position,
        dimensions: zone1Dimensions,

        keyLightMode: "enabled",
        keyLight:{"color": {"red":200,"green":0,"blue":0}},

        skyboxMode: "enabled",
        skybox:{"color":{"red":200,"green":0,"blue":0}}
    };
    var zone1 = Entities.addEntity(zone1properties);

    var zone2properties = {
        type: "Zone",
        name: "zone 2",
        position: zone2Position,
        dimensions: zone2Dimensions,

        keyLightMode: "enabled",
        keyLight:{"color": {"red":150,"green":150,"blue":0}},

        skyboxMode: "enabled",
        skybox:{"color":{"red":150,"green":150,"blue":0}}
    };
    var zone2 = Entities.addEntity(zone2properties);

    var zone3properties = {
        type: "Zone",
        name: "zone 3",
        position: zone3Position,
        dimensions: zone3Dimensions,

        keyLightMode: "enabled",
        keyLight:{"color": {"red":0,"green":200,"blue":0}},

        skyboxMode: "enabled",
        skybox:{"color":{"red":0,"green":200,"blue":0}}
    };
    var zone3 = Entities.addEntity(zone3properties);

    var zone4properties = {
        type: "Zone",
        name: "zone 4",
        position: zone4Position,
        dimensions: zone4Dimensions,

        keyLightMode: "enabled",
        keyLight:{"color": {"red":0,"green":0,"blue":200}},

        skyboxMode: "enabled",
        skybox:{"color":{"red":0,"green":0,"blue":200}}
    };
    var zone4 = Entities.addEntity(zone4properties);

    // Show zone positions on the ground
    var marker1Dimensions = { x: 20.0, y: 0.01, z: 40.0};
    var marker2Dimensions = { x: 30.0, y: 0.01, z: 20.0};
    var marker3Dimensions = { x: 10.0, y: 0.01, z: 30.0};
    var marker4Dimensions = { x:  6.0, y: 0.01, z: 20.0};

    var marker1properties = {
        type: "Box",
        name: "marker 1",
        position: zone1Position,
        dimensions: marker1Dimensions,
        "color": {"red":200,"green":0,"blue":0},
        visible: true
    };
    var marker1 = Entities.addEntity(marker1properties);

    var marker2properties = {
        type: "Box",
        name: "marker 2",
        position: zone2Position,
        dimensions: marker2Dimensions,
        "color": {"red":150,"green":150,"blue":0},
        visible: true
    };
    var marker2 = Entities.addEntity(marker2properties);

    var marker3properties = {
        type: "Box",
        name: "marker 3",
        position: zone3Position,
        dimensions: marker3Dimensions,
        "color": {"red":0,"green":200,"blue":0},
        visible: true
    };
    var marker3 = Entities.addEntity(marker3properties);

    var marker4properties = {
        type: "Box",
        name: "marker 4",
        position: zone4Position,
        dimensions: marker4Dimensions,
        "color": {"red":0,"green":0,"blue":200},
        visible: true
    };
    var marker4 = Entities.addEntity(marker4properties);

    // Move avatar 20 metres back
    MyAvatar.position.z  = avatarOriginPosition.z -20.0;
    
    // Note that the image for the current step is snapped at the beginning of the next step.
    // This is because it may take a while for the image to stabilize.
    var STEP_TIME = 2000;
    
    // An array of tests is created.  These may be called via the timing mechanism for auto-testing,
    // or stepped through with the space bar
    var steps = [
        function () {
            spectatorCameraConfig.position = {x: avatarOriginPosition.x, y: avatarOriginPosition.y + 0.6, z: avatarOriginPosition.z};
        },
        
        function () {
            MyAvatar.position  = {x: avatarOriginPosition.x + 7.0, y: avatarOriginPosition.y + 1.0, z: avatarOriginPosition.z - 19.0};
            spectatorCameraConfig.position = {x: avatarOriginPosition.x + 7.0, y: avatarOriginPosition.y + 1.0 + 0.6, z: avatarOriginPosition.z - 19.0};
        },
        
        function () {
            MyAvatar.position  = {x: avatarOriginPosition.x + 4.0, y: avatarOriginPosition.y + 1.0, z: avatarOriginPosition.z - 11.0};
            spectatorCameraConfig.position = {x: avatarOriginPosition.x + 4.0, y: avatarOriginPosition.y + 1.0 + 0.6, z: avatarOriginPosition.z - 11.0};
        },
        
        function () {
            MyAvatar.position  = {x: avatarOriginPosition.x + 1.0, y: avatarOriginPosition.y + 1.0, z: avatarOriginPosition.z - 5.0};
            spectatorCameraConfig.position  = {x: avatarOriginPosition.x + 1.0, y: avatarOriginPosition.y + 1.0 + 0.6, z: avatarOriginPosition.z - 5.0};
        },
        
        function () {
            MyAvatar.position  = {x: avatarOriginPosition.x + 0.0, y: avatarOriginPosition.y + 1.0, z: avatarOriginPosition.z + 4.0};
            spectatorCameraConfig.position  = {x: avatarOriginPosition.x + 0.0, y: avatarOriginPosition.y + 1.0 + 0.6, z: avatarOriginPosition.z + 4.0};
        },
        
        function () {
            MyAvatar.position  = {x: avatarOriginPosition.x - 4.0, y: avatarOriginPosition.y + 1.0, z: avatarOriginPosition.z + 11.0};
            spectatorCameraConfig.position  = {x: avatarOriginPosition.x - 4.0, y: avatarOriginPosition.y + 1.0 + 0.6, z: avatarOriginPosition.z + 11.0};
        },
        
        function () {
            MyAvatar.position  = {x: avatarOriginPosition.x - 8.0, y: avatarOriginPosition.y + 1.0, z: avatarOriginPosition.z + 15.0};
            spectatorCameraConfig.position  = {x: avatarOriginPosition.x - 8.0, y: avatarOriginPosition.y + 1.0 + 0.6, z: avatarOriginPosition.z + 15.0};
        },
        
        function () {
            MyAvatar.position  = {x: avatarOriginPosition.x - 13.0, y: avatarOriginPosition.y + 1.0, z: avatarOriginPosition.z + 16.0};
            spectatorCameraConfig.position  = {x: avatarOriginPosition.x - 13.0, y: avatarOriginPosition.y + 1.0 + 0.6, z: avatarOriginPosition.z + 16.0};
        },
        
        function () {
            MyAvatar.position  = {x: avatarOriginPosition.x + 8.0, y: avatarOriginPosition.y + 1.0, z: avatarOriginPosition.z + 19.0};
            spectatorCameraConfig.position  = {x: avatarOriginPosition.x + 8.0, y: avatarOriginPosition.y + 1.0 + 0.6, z: avatarOriginPosition.z + 19.0};
        },
        
        // Take final snapshot
        function () {
        },
        
        // Clean up after test
        function () {
            Entities.deleteEntity(marker1);
            Entities.deleteEntity(marker2);
            Entities.deleteEntity(marker3);
            Entities.deleteEntity(marker4);
            Entities.deleteEntity(zone1);
            Entities.deleteEntity(zone2);
            Entities.deleteEntity(zone3);
            Entities.deleteEntity(zone4);
          
            MyAvatar.position  = {x: avatarOriginPosition.x, y: avatarOriginPosition.y, z: avatarOriginPosition.z};
            spectatorCameraConfig.position = {x: avatarOriginPosition.x, y: avatarOriginPosition.y + 0.6, z: avatarOriginPosition.z};

            module.exports.complete = true;
        }
    ]
    
    var i = 0;
    if (testType  == "auto") {
        autoTester.addStep(false, steps[i++], STEP_TIME);
        autoTester.addStep(true, steps[i++], STEP_TIME);
        autoTester.addStep(true, steps[i++], STEP_TIME);
        autoTester.addStep(true, steps[i++], STEP_TIME);
        autoTester.addStep(true, steps[i++], STEP_TIME);
        autoTester.addStep(true, steps[i++], STEP_TIME);
        autoTester.addStep(true, steps[i++], STEP_TIME);
        autoTester.addStep(true, steps[i++], STEP_TIME);
        autoTester.addStep(true, steps[i++], STEP_TIME);
        autoTester.addStep(true, steps[i++], STEP_TIME);
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
