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
    
    // The models are loaded from the "MODEL_DIR_URL" located on github where we store all our test models
    var MODEL_DIR_URL = "https://github.com/highfidelity/hifi_tests/blob/master/assets/models/material_matrix_models/fbx/blender/";
    var MODEL_NAME_SUFFIX = ".fbx?raw=true";

    var MODEL_DIMS = {"x":0.809423565864563,"y":0.9995689988136292,"z":0.8092837929725647};
    var MODEL_SCALE = 0.75;
    var UNIT = MODEL_SCALE * (MODEL_DIMS.x + MODEL_DIMS.z);

    // We are looking towards negative Z
    var OBJ_DX = 0.0;
    var OBJ_DY = 0.65;
    var OBJ_DZ = -2.0;

    // Look down Z axis and get present position
    MyAvatar.bodyYaw = 0.0;
    MyAvatar.bodyPitch = 0.0;
    MyAvatar.bodyRoll = 0.0;
    MyAvatar.headYaw = 0.0;
    MyAvatar.headPitch = 0.0;
    MyAvatar.headRoll = 0.0;

    var avatarOriginPosition = MyAvatar.position;

    // Place object relatively to the avatar (object will always be placed in the same relative position)
    var objectOrientation = Quat.fromPitchYawRollDegrees(0.0, 0.0, 0.0);
    var objectPosition = {x: avatarOriginPosition.x + OBJ_DX, y: avatarOriginPosition.y + OBJ_DY, z: avatarOriginPosition.z  + OBJ_DZ};

    var objectName = "hifi_roughnessV00_metallicV_albedoV_ao";
    var objectProperties = {
        type: "Model",
        modelURL: MODEL_DIR_URL + objectName + MODEL_NAME_SUFFIX,
        name: objectName,
        position: objectPosition,    
        rotation: objectOrientation,    
        dimensions: Vec3.multiply(MODEL_SCALE, MODEL_DIMS),
    };
    var object = Entities.addEntity(objectProperties);

    // Setup 3 zones
    var zone1Dimensions = { x: 10.0, y: 10.0, z: 40.0};
    var zone2Dimensions = { x:  8.0, y: 10.0, z: 20.0};
    var zone3Dimensions = { x:  4.0, y: 10.0, z: 30.0};

    var zone1properties = {
        type: "Zone",
        name: "Zone 1",

        position: {x: MyAvatar.position.x, y: MyAvatar.position.y - 2.0, z: MyAvatar.position.z - 25.0},
        rotation: MyAvatar.orientation,    
        dimensions: zone1Dimensions,

        keyLight:{
            color: {"red":255,"green":255,"blue":255},
            direction: {
                "x": 0.037007175385951996,
                "y": -0.7071067690849304,
                "z": -0.7061376571655273
            },
            intensity: 0.8
        },

        backgroundMode:"skybox",
        skybox:{
            color: {"red":255,"green":255,"blue":255},
            url: "http://hifi-content.s3.amazonaws.com/DomainContent/baked/island/Sky_Day-Sun-Mid-photo.ktx"
        }
    };
    var zone1 = Entities.addEntity(zone1properties);

    var zone2properties = {
        type: "Zone",
        name: "Zone 2",

        position: {x: MyAvatar.position.x, y: MyAvatar.position.y - 2.0, z: MyAvatar.position.z - 25.0},
        rotation: MyAvatar.orientation,    
        dimensions: zone2Dimensions,

        keyLight:{
            color: {"red":255,"green":255,"blue":255},
            direction: {
                "x": 0.037007175385951996,
                "y": -0.7071067690849304,
                "z": -0.7061376571655273
            },
            intensity: 0.8
        },

        backgroundMode:"skybox",
        skybox:{
            color: {"red":255,"green":255,"blue":255},
            url: "https://hifi-public.s3.amazonaws.com/images/SkyboxTextures/ThickCloudsWater2.jpg"
        }
    };
    var zone2 = Entities.addEntity(zone2properties);

    var zone3properties = {
        type: "Zone",
        name: "Zone 3",

        position: {x: MyAvatar.position.x, y: MyAvatar.position.y - 2.0, z: MyAvatar.position.z - 25.0},
        rotation: MyAvatar.orientation,    
        dimensions: zone3Dimensions,

        keyLight:{
            color: {"red":255,"green":255,"blue":255},
            direction: {
                "x": 0.037007175385951996,
                "y": -0.7071067690849304,
                "z": -0.7061376571655273
            },
            intensity: 0.8
        },

        backgroundMode:"skybox",
        skybox:{
            color: {"red":255,"green":255,"blue":255},
            url: "https://hifi-public.s3.amazonaws.com/images/SkyboxTextures/FullMoon1024Compressed.jpg"
        }
    };
    var zone3 = Entities.addEntity(zone3properties);

    // Show zone positions with rectangles
    var marker1Dimensions = { x: 10.0, y: 0.01, z: 40.0};
    var marker2Dimensions = { x:  8.0, y: 0.01, z: 20.0};
    var marker3Dimensions = { x:  4.0, y: 0.01, z: 30.0};

    var marker1properties = {
        type: "Box",
        name: "marker 1",
        position: {x: MyAvatar.position.x, y: MyAvatar.position.y - 5.0, z: MyAvatar.position.z - 25.0},
        dimensions: marker1Dimensions,
        "color": {"red":200,"green":0,"blue":0},
        visible: true
    };
    var marker1 = Entities.addEntity(marker1properties);

    var marker2properties = {
        type: "Box",
        name: "marker 2",
        position: {x: MyAvatar.position.x, y: MyAvatar.position.y - 5.0 + 0.01, z: MyAvatar.position.z - 25.0},
        dimensions: marker2Dimensions,
        "color": {"red":150,"green":150,"blue":0},
        visible: true
    };
    var marker2 = Entities.addEntity(marker2properties);

    var marker3properties = {
        type: "Box",
        name: "marker 3",
        position: {x: MyAvatar.position.x, y: MyAvatar.position.y - 5.0 + 0.02, z: MyAvatar.position.z - 25.0},
        dimensions: marker3Dimensions,
        "color": {"red":0,"green":200,"blue":0},
        visible: true
    };
    var marker3 = Entities.addEntity(marker3properties);

    function deleteEntities() {
        Entities.deleteEntity(object);
        Entities.deleteEntity(zone1);
        Entities.deleteEntity(zone2);
        Entities.deleteEntity(zone3);
        Entities.deleteEntity(marker1);
        Entities.deleteEntity(marker2);
        Entities.deleteEntity(marker3);
    }
	
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
            MyAvatar.position  = {x: avatarOriginPosition.x, y: avatarOriginPosition.y, z: avatarOriginPosition.z - 7.5};
            spectatorCameraConfig.position = {x: avatarOriginPosition.x, y: avatarOriginPosition.y + 0.6, z: avatarOriginPosition.z - 7.5};
            
            var newProperty = { 
                position: {x: MyAvatar.position.x + OBJ_DX, y: MyAvatar.position.y + OBJ_DY, z: MyAvatar.position.z + OBJ_DZ}
            };
            Entities.editEntity(object, newProperty);  
        },
        
        function () {
            MyAvatar.position  = {x: avatarOriginPosition.x, y: avatarOriginPosition.y, z: avatarOriginPosition.z - 12.5};
            spectatorCameraConfig.position = {x: avatarOriginPosition.x, y: avatarOriginPosition.y + 0.6, z: avatarOriginPosition.z - 12.5};

            var newProperty = { 
                position: {x: MyAvatar.position.x + OBJ_DX, y: MyAvatar.position.y + OBJ_DY, z: MyAvatar.position.z + OBJ_DZ}
            };
            Entities.editEntity(object, newProperty);
        },
        
        function () {
            MyAvatar.position  = {x: avatarOriginPosition.x + 3.0, y: avatarOriginPosition.y, z: avatarOriginPosition.z - 17.5};
            spectatorCameraConfig.position = {x: avatarOriginPosition.x + 3.0, y: avatarOriginPosition.y + 0.6, z: avatarOriginPosition.z - 17.5};

            var newProperty = { 
                position: {x: MyAvatar.position.x + OBJ_DX, y: MyAvatar.position.y + OBJ_DY, z: MyAvatar.position.z + OBJ_DZ}
            };
            Entities.editEntity(object, newProperty);  
        },
        
        function () {
            MyAvatar.position  = {x: avatarOriginPosition.x, y: avatarOriginPosition.y, z: avatarOriginPosition.z - 17.5};
            spectatorCameraConfig.position = {x: avatarOriginPosition.x, y: avatarOriginPosition.y + 0.6, z: avatarOriginPosition.z - 17.5};
            
            var newProperty = { 
                position: {x: MyAvatar.position.x + OBJ_DX, y: MyAvatar.position.y + OBJ_DY, z: MyAvatar.position.z + OBJ_DZ}
            };
            Entities.editEntity(object, newProperty);  
        },
        
        function () {
        },
        
        function () {
            deleteEntities();
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
        autoTester.addStep(false, steps[i++], STEP_TIME);
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