module.exports.complete = false;

module.exports.test = function (testType) {
    var autoTester = Script.require("../../../../utils/autoTester.js");

    // Load terrain
    var position =  MyAvatar.position;
    position.x = position.x - 5000.0;
    position.y = position.y + 20.0;

    var TERRAIN_URL = Script.resolvePath('../../../../../tools/autoTester/resources/Nevada-Moon-Rocks.baked.fbx');
    var terrain = Entities.addEntity({
        type: 'Model',
        name: 'Terrain',
        modelURL: TERRAIN_URL,
        shapeType: 'box',
        dimensions: { x: 10000.0, y: 600.0, z: 10000.0 },
        position: position
    });

    var SKY_URL = Script.resolvePath('../../../../../tools/autoTester/resources/Sky_Day-Sun-Mid-photo.ktx');
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

    autoTester.setupSnapshots(Script.resolvePath("."));
    var spectatorCameraConfig = Render.getConfig("SecondaryCamera");
	spectatorCameraConfig.position = {x: MyAvatar.position.x, y: MyAvatar.position.y + 0.6, z: MyAvatar.position.z};
    
    // Look down X axis
    MyAvatar.bodyYaw = 90.0;
    MyAvatar.headYaw = 90.0;
    spectatorCameraConfig.orientation = { x: 0.0, y: 0.7071, z: 0.0, w: 0.7071 };
    
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
    
    if (testType  == "auto") {
        autoTester.addStep(false, steps[0], STEP_TIME);
        autoTester.addStep(true, steps[1], STEP_TIME);
        autoTester.addStep(true, steps[2], STEP_TIME);
        autoTester.addStep(true, steps[3], STEP_TIME);
        autoTester.addStep(true, steps[4], STEP_TIME);
        autoTester.addStep(true, steps[5], STEP_TIME);
        autoTester.addStep(true, steps[6], STEP_TIME);
        autoTester.addStep(true, steps[7], STEP_TIME);
        autoTester.addStep(true, steps[8], STEP_TIME);  
        autoTester.addStep(true, steps[9], STEP_TIME);
        autoTester.addStep(true, steps[10], STEP_TIME);
        autoTester.addStep(true, steps[11], STEP_TIME);
    } else {
        var _step = 0;
        Controller.keyPressEvent.connect(
            function(event){
                if (event.key == 32) {
                    print("Running step " + (_step + 1));
                    steps[_step]();
                    _step++;
                    _step = Math.min(_step, steps.length-1);
                }
            }
        );
    }
};
