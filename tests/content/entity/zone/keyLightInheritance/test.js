module.exports.complete = false;

module.exports.test = function (testType) {
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
     
    // Look down Z axis
    MyAvatar.bodyYaw   = 0.0;
    MyAvatar.bodyPitch = 0.0;
    MyAvatar.bodyRoll  = 0.0;
    MyAvatar.headYaw   = 0.0;
    MyAvatar.headPitch = 0.0;
    MyAvatar.headRoll  = 0.0;
    spectatorCameraConfig.orientation = { x: 0.0, y: 0.0, z: 0.0, w: 0.0 };
	spectatorCameraConfig.position = {x: MyAvatar.position.x, y: MyAvatar.position.y + 0.6, z: MyAvatar.position.z};
   
    // Set up test environment
    var avatarOriginPosition = MyAvatar.position;
    
    var zone1Position = { x: avatarOriginPosition.x, y: avatarOriginPosition.y + 0.01, z: avatarOriginPosition.z - 15.0 };
    var zone2Position = { x: avatarOriginPosition.x, y: avatarOriginPosition.y + 0.02, z: avatarOriginPosition.z - 15.0 };
    var zone3Position = { x: avatarOriginPosition.x, y: avatarOriginPosition.y + 0.03, z: avatarOriginPosition.z - 15.0 };

    var zoneHeight = 10.0;
    var zone1Dimensions = { x: 40.0, y: zoneHeight, z: 40.0};
    var zone2Dimensions = { x: 30.0, y: zoneHeight, z: 30.0};
    var zone3Dimensions = { x: 20.0, y: zoneHeight, z: 20.0};
    
    // Create zones
    var zone1properties = {
        type: "Zone",
        name: "zone 1",
        position: zone1Position,
        dimensions: zone1Dimensions,
        keyLight:{"color": {"red":200,"green":0,"blue":0}},
        backgroundMode:"skybox",
        skybox:{"color":{"red":200,"green":0,"blue":0}}
    };
    var zone1 = Entities.addEntity(zone1properties);

    var zone2properties = {
        type: "Zone",
        name: "zone 2",
        position: zone2Position,
        dimensions: zone2Dimensions,
        keyLight:{"color": {"red":0,"green":200,"blue":0}},
        backgroundMode:"skybox",
        skybox:{"color":{"red":0,"green":200,"blue":0}}
    };
    var zone2 = Entities.addEntity(zone2properties);

    var zone3properties = {
        type: "Zone",
        name: "zone 3",
        position: zone3Position,
        dimensions: zone3Dimensions,
        keyLight:{"color": {"red":0,"green":0,"blue":200}},
        backgroundMode:"skybox",
        skybox:{"color":{"red":0,"green":0,"blue":200}}
    };
    var zone3 = Entities.addEntity(zone3properties);

    // Note that the image for the current step is snapped at the beginning of the next step.
    // This is because it may take a while for the image to stabilize.
    var STEP_TIME = 2000;
    
    // An array of tests is created.  These may be called via the timing mechanism for auto-testing,
    // or stepped through with the space bar
    var steps = [
        function () {
        },
        
        // In Red zone, keylight is inherit
        function () {
            MyAvatar.position  = {x: avatarOriginPosition.x, y: avatarOriginPosition.y, z: avatarOriginPosition.z - 5.0};           
            spectatorCameraConfig.position = {x: avatarOriginPosition.x , y: avatarOriginPosition.y + 0.6, z: avatarOriginPosition.z - 5.0};
        },
        
        function () {
            MyAvatar.position  = {x: avatarOriginPosition.x, y: avatarOriginPosition.y, z: avatarOriginPosition.z - 10.0};           
            spectatorCameraConfig.position = {x: avatarOriginPosition.x , y: avatarOriginPosition.y + 0.6, z: avatarOriginPosition.z - 10.0};
        },
        
        function () {
            MyAvatar.position  = {x: avatarOriginPosition.x, y: avatarOriginPosition.y, z: avatarOriginPosition.z - 15.0};           
            spectatorCameraConfig.position = {x: avatarOriginPosition.x , y: avatarOriginPosition.y + 0.6, z: avatarOriginPosition.z - 15.0};
        },
        
        function () {
            Entities.deleteEntity(zone1);
            Entities.deleteEntity(zone2);
            Entities.deleteEntity(zone3);
          
            MyAvatar.position  = {x: avatarOriginPosition.x, y: avatarOriginPosition.y, z: avatarOriginPosition.z};
            spectatorCameraConfig.position = {x: avatarOriginPosition.x, y: avatarOriginPosition.y + 0.6, z: avatarOriginPosition.z};

            module.exports.complete = true;
        }
    ];
    
    var i = 0;
    if (testType  == "auto") {
        autoTester.addStep(false, steps[i++], STEP_TIME);
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
