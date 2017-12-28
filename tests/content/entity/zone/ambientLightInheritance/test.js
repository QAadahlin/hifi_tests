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
    var zoneRedProperties = {
        type: "Zone",
        name: "zone red",
        position: zoneRedPosition,
        dimensions: zoneRedDimensions,
        keyLightMode: "disabled",
        ambientLightMode: "enabled",
        ambientLight: {
            ambientURL: "http://hifi-content.s3.amazonaws.com/DomainContent/baked/island/Sky_Day-Sun-Mid-photo.ktx"
        },
        backgroundMode:"nothing"
    };
    var zoneRed = Entities.addEntity(zoneRedProperties);

    var zoneGreenProperties = {
        type: "Zone",
        name: "zone green",
        position: zoneGreenPosition,
        dimensions: zoneGreenDimensions,
        keyLightMode: "disabled",
        ambientLightMode: "enabled",
        ambientLight: {
            ambientURL: "https://hifi-public.s3.amazonaws.com/images/SkyboxTextures/ThickCloudsWater2.jpg"
        },
        backgroundMode:"nothing"
    };
    var zoneGreen = Entities.addEntity(zoneGreenProperties);

    var zoneBlueProperties = {
        type: "Zone",
        name: "zone blue",
        position: zoneBluePosition,
        dimensions: zoneBlueDimensions,
        keyLightMode: "disabled",
        ambientLightMode: "enabled",
        ambientLight: {
            ambientURL: "https://hifi-public.s3.amazonaws.com/images/SkyboxTextures/FullMoon1024Compressed.jpg"
        },
        backgroundMode:"nothing"
    };
    var zoneBlue = Entities.addEntity(zoneBlueProperties);
    
    // Add a white sphere
    var DX = 0.0;
    var DY = 0.6;
    var DZ = -2.0;
    var sphereProperties = {
        type: "Sphere",
        name: "sphere",
        position: {x: MyAvatar.position.x + DX, y: MyAvatar.position.y + DY, z: MyAvatar.position.z + DZ},
        dimensions: { x: 0.4, y: 0.4, z: 0.4 },
        "color": {"red":255,"green":255,"blue":255},
        visible: true
    };
    var sphere = Entities.addEntity(sphereProperties);
    
    // Note that the image for the current step is snapped at the beginning of the next step.
    // This is because it may take a while for the image to stabilize.
    var STEP_TIME = 2000;
    
    // An array of tests is created.  These may be called via the timing mechanism for auto-testing,
    // or stepped through with the space bar
    var steps = [
        function () {
            print("red zone, bright ambient light");
        },
        
        function () {
            print("green zone, medium ambient light");
            MyAvatar.position  = {x: avatarOriginPosition.x, y: avatarOriginPosition.y, z: avatarOriginPosition.z - 5.0};           
            spectatorCameraConfig.position = {x: avatarOriginPosition.x , y: avatarOriginPosition.y + 0.6, z: avatarOriginPosition.z - 5.0};

            var newProperty = {position: {x: MyAvatar.position.x + DX, y: MyAvatar.position.y + DY, z: MyAvatar.position.z + DZ}};
            Entities.editEntity(sphere, newProperty);
        },
        
        function () {
            print("blue zone, dark ambient light");
            MyAvatar.position  = {x: avatarOriginPosition.x, y: avatarOriginPosition.y, z: avatarOriginPosition.z - 10.0};           
            spectatorCameraConfig.position = {x: avatarOriginPosition.x , y: avatarOriginPosition.y + 0.6, z: avatarOriginPosition.z - 10.0};

            var newProperty = {position: {x: MyAvatar.position.x + DX, y: MyAvatar.position.y + DY, z: MyAvatar.position.z + DZ}};
            Entities.editEntity(sphere, newProperty);  
        },
        
        function () {
            print("blue off,  no ambient light");
            var newProperty = {ambientLightMode: "disabled"};
            Entities.editEntity(zoneBlue, newProperty);  
        },
        
        function () {
            print("blue inherit, medium ambient light");
            var newProperty = {ambientLightMode: "inherit"};
            Entities.editEntity(zoneBlue, newProperty);  
        },
        
        function () {
            print("green off,  no ambient light");
            var newProperty = {ambientLightMode: "disabled"};
            Entities.editEntity(zoneGreen, newProperty);  
        },
        
        function () {
            print("green inherit, bright ambient light");
            var newProperty = {ambientLightMode: "inherit"};
            Entities.editEntity(zoneGreen, newProperty);  
        },
        
        function () {
            print("red off,  no ambient light");
            var newProperty = {ambientLightMode: "disabled"};
            Entities.editEntity(zoneRed, newProperty);  
        },
        
        function () {
            print("green zone, still no ambient light");
            MyAvatar.position  = {x: avatarOriginPosition.x, y: avatarOriginPosition.y, z: avatarOriginPosition.z - 5.0};           
            spectatorCameraConfig.position = {x: avatarOriginPosition.x , y: avatarOriginPosition.y + 0.6, z: avatarOriginPosition.z - 5.0};

            var newProperty = {position: {x: MyAvatar.position.x + DX, y: MyAvatar.position.y + DY, z: MyAvatar.position.z + DZ}};
            Entities.editEntity(sphere, newProperty);  
        },
                
        function () {
            print("red on, bright ambient light");
            var newProperty = {ambientLightMode: "enabled"};
            Entities.editEntity(zoneRed, newProperty);  
        },

        function () {
            Entities.deleteEntity(zoneRed);
            Entities.deleteEntity(zoneGreen);
            Entities.deleteEntity(zoneBlue);
            Entities.deleteEntity(sphere);
          
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
