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
     
    // Look down X axis
    MyAvatar.bodyYaw = 90.0;
    MyAvatar.headYaw = 90.0;
    spectatorCameraConfig.orientation = { x: 0.0, y: 0.7071, z: 0.0, w: 0.7071 };
   
    // Load models
    var TERRAIN_URL = Script.resolvePath(prefix + '../tools/autoTester/resources/Nevada-Moon-Rocks.baked.fbx');
    var terrain = Entities.addEntity({
        type: 'Model',
        name: 'Terrain',
        modelURL: TERRAIN_URL,
        shapeType: 'box',
        dimensions: { x: 10000.0, y: 600.0, z: 10000.0 },
        position: {x: MyAvatar.position.x - 5000, y: MyAvatar.position.y + 2.0, z: MyAvatar.position.z},
    });

    var SKY_URL = Script.resolvePath(prefix + '../tools/autoTester/resources/Sky_Day-Sun-Mid-photo.ktx');
    var sky = Entities.addEntity({
        type: "Zone",
        name: "Sky",

        position: {x: MyAvatar.position.x, y: MyAvatar.position.y - 2.0, z: MyAvatar.position.z - 25.0},
        rotation: MyAvatar.orientation,    
        dimensions: { x: 10000.0, y: 600.0, z: 10000.0 },

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
            url: SKY_URL
        }
    });

    var TREE_URL = Script.resolvePath(prefix + '../tools/autoTester/resources/PalmTree.fbx');
    var tree = Entities.addEntity({
        type: 'Model',
        name: 'Tree',
        shapeType: 'none',
        modelURL: TREE_URL,
        dimensions: { x: 5.0415, y: 12.1722, z: 4.9470 },
        position: {x: MyAvatar.position.x - 100.0, y: MyAvatar.position.y, z: MyAvatar.position.z},
    });

	spectatorCameraConfig.position = {x: MyAvatar.position.x, y: MyAvatar.position.y + 0.6, z: MyAvatar.position.z};
    
    // Note that the image for the current step is snapped at the beginning of the next step.
    // This is because it may take a while for the image to stabilize.
    var STEP_TIME = 2000;
    
    // An array of tests is created.  These may be called via the timing mechanism for auto-testing,
    // or stepped through with the space bar
    var steps = [
        function () {
        },
        
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

        },
        
        // Turn on altitude effect
        function () {
            var newProperty = { 
                haze: {
                    hazeAltitudeEffect: 1
                }
            };
            Entities.editEntity(sky, newProperty);  

        },
        
        // Set ceiling to 500
        function () {
            var newProperty = { 
                haze: {
                    hazeCeiling: 500.0
                }
            };
            Entities.editEntity(sky, newProperty);  

        },
        
        // Set base to -400
        function () {
            var newProperty = { 
                haze: {
                    hazeBaseRef: -400.0
                }
            };
            Entities.editEntity(sky, newProperty);  

        },
        
        // Set base to 0 and colour sandy
        function () {
            var newProperty = { 
                haze: {
                    hazeBaseRef: 0.0,
                    hazeColor:{"red":153,"green":107,"blue":47}
                }
            };
            Entities.editEntity(sky, newProperty);  

        },
        
        // Set background blend to 1, then back to 0
        function () {
            var newProperty = { 
                haze: {
                    hazeBackgroundBlend: 1.0
                }
            };
            Entities.editEntity(sky, newProperty);  

        },
        function () {
            var newProperty = { 
                haze: {
                    hazeBackgroundBlend: 0.0
                }
            };
            Entities.editEntity(sky, newProperty);  

        },
    
        // Test glare effect (sun is 15 degrees elevation, 095 azimuth)
        function () {
            var newProperty = {
                keyLight: {
                    direction:{"x":0.9622501869, "y":-0.2588190451, "z":-0.08418598283}
                },
                haze: {
                    hazeCeiling: 5000.0,
                    hazeEnableGlare: 1,
                    hazeGlareColor:{"red":176,"green":25,"blue":68},
                }
            };
            Entities.editEntity(sky, newProperty);  

        },
        function () {
            var newProperty = { 
                haze: {
                    hazeGlareAngle: 5
                }
            };
            Entities.editEntity(sky, newProperty);  

        },
        
        function () {
            Entities.deleteEntity(terrain);
            Entities.deleteEntity(sky);
            
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
