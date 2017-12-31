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
    
    var zoneRedPosition   = { x: avatarOriginPosition.x, y: avatarOriginPosition.y - 4.0, z: avatarOriginPosition.z - 17.5 };
    var zoneBluePosition  = { x: avatarOriginPosition.x, y: avatarOriginPosition.y - 4.0, z: avatarOriginPosition.z - 17.5 };
    var zoneGreenPosition = { x: avatarOriginPosition.x, y: avatarOriginPosition.y - 4.0, z: avatarOriginPosition.z - 17.5 };

    var ZONE_HEIGHT = 10.0;
    var zoneRedDimensions   = { x: 40.0, y: ZONE_HEIGHT, z: 40.0};
    var zoneGreenDimensions = { x: 30.0, y: ZONE_HEIGHT, z: 30.0};
    var zoneBlueDimensions  = { x: 20.0, y: ZONE_HEIGHT, z: 20.0};
    
    // Create zones
    var BRIGHT_SKY_URL = Script.resolvePath(prefix + '../tools/autoTester/resources/Sky_Day-Sun-Mid-photo.ktx');
    var zoneRedProperties = {
        type: "Zone",
        name: "zone red",
        position: zoneRedPosition,
        dimensions: zoneRedDimensions,
        
        keyLightMode: "disabled",
        ambientLightMode: "disabled",
        
        skyboxMode:"enabled",
        skybox: {
            color: {"red":255,"green":255,"blue":255},
            url: BRIGHT_SKY_URL
        }
    };
    var zoneRed = Entities.addEntity(zoneRedProperties);

    var CLOUDY_SKY_URL = Script.resolvePath(prefix + '../tools/autoTester/resources/ThickCloudsWater2.jpg');
    var zoneGreenProperties = {
        type: "Zone",
        name: "zone green",
        position: zoneGreenPosition,
        dimensions: zoneGreenDimensions,
        
        keyLightMode: "disabled",
        ambientLightMode: "disabled",
        
        skyboxMode:"enabled",
        skybox: {
            color: {"red":255,"green":255,"blue":255},
            url: CLOUDY_SKY_URL
        }
    };
    var zoneGreen = Entities.addEntity(zoneGreenProperties);

    var NIGHT_SKY_URL = Script.resolvePath(prefix + '../tools/autoTester/resources/FullMoon1024Compressed.jpg');
    var zoneBlueProperties = {
        type: "Zone",
        name: "zone blue",
        position: zoneBluePosition,
        dimensions: zoneBlueDimensions,
        
        keyLightMode: "disabled",
        ambientLightMode: "disabled",

        skyboxMode:"enabled",
        skybox: {
            color: {"red":255,"green":255,"blue":255},
            url: NIGHT_SKY_URL
        }
    };
    var zoneBlue = Entities.addEntity(zoneBlueProperties);
 
    var DX =  0.0;
    var DY =  0.6;
    var DZ = -2.0;
 
    // Note that the image for the current step is snapped at the beginning of the next step.
    // This is because it may take a while for the image to stabilize.
    var STEP_TIME = 2000;
    
    // An array of tests is created.  These may be called via the timing mechanism for auto-testing,
    // or stepped through with the space bar
    var steps = [
        function () {
            print("red zone, bright sky");
        },
        
        function () {
            print("green zone, cloudy");
            MyAvatar.position  = {x: avatarOriginPosition.x, y: avatarOriginPosition.y, z: avatarOriginPosition.z - 5.0};           
            spectatorCameraConfig.position = {x: avatarOriginPosition.x , y: avatarOriginPosition.y + 0.6, z: avatarOriginPosition.z - 5.0};
        },
        
        function () {
            print("blue zone, night");
            MyAvatar.position  = {x: avatarOriginPosition.x, y: avatarOriginPosition.y, z: avatarOriginPosition.z - 10.0};           
            spectatorCameraConfig.position = {x: avatarOriginPosition.x , y: avatarOriginPosition.y + 0.6, z: avatarOriginPosition.z - 10.0};
        },
        
        function () {
            print("blue off, dark");
            var newProperty = {skyboxMode: "disabled"};
            Entities.editEntity(zoneBlue, newProperty);  
        },
        
        function () {
            print("blue inherit, cloudy");
            var newProperty = {skyboxMode: "inherit"};
            Entities.editEntity(zoneBlue, newProperty);  
        },
        
        function () {
            print("green off, dark");
            var newProperty = {skyboxMode: "disabled"};
            Entities.editEntity(zoneGreen, newProperty);  
        },
        
        function () {
            print("green inherit, bright sky");
            var newProperty = {skyboxMode: "inherit"};
            Entities.editEntity(zoneGreen, newProperty);  
        },
        
        function () {
            print("red off, dark");
            var newProperty = {skyboxMode: "disabled"};
            Entities.editEntity(zoneRed, newProperty);  
        },
        
        function () {
            print("green zone, still dark");
            MyAvatar.position  = {x: avatarOriginPosition.x, y: avatarOriginPosition.y, z: avatarOriginPosition.z - 5.0};           
            spectatorCameraConfig.position = {x: avatarOriginPosition.x , y: avatarOriginPosition.y + 0.6, z: avatarOriginPosition.z - 5.0};
        },
                
        function () {
            print("red on, bright sky");
            var newProperty = {skyboxMode: "enabled"};
            Entities.editEntity(zoneRed, newProperty);  
        },

        function () {
            Entities.deleteEntity(zoneRed);
            Entities.deleteEntity(zoneGreen);
            Entities.deleteEntity(zoneBlue);
          
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
