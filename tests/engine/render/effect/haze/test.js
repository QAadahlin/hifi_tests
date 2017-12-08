module.exports.complete = false;

module.exports.test = function () {
    var autoTester = Script.require("../../../../utils/autoTester.js");

    // Load terrain
    var position =  MyAvatar.position;
    position.x = position.x - 5000.0;
    position.y = position.y + 20.0;

    var TERRAIN_URL = Script.resolvePath('./Nevada-Moon-Rocks.baked.fbx');
    var terrain = Entities.addEntity({
        type: 'Model',
        name: 'Terrain',
        modelURL: TERRAIN_URL,
        shapeType: 'box',
        dimensions: { x: 10000.0, y: 600.0, z: 10000.0 },
        position: position
    });

    var SKY_URL = Script.resolvePath('./Sky_Day-Sun-Mid-photo.ktx');
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
    
    // Note that the image for the current step is snapped at the beginning of the next step.
    // This is because it may take a while for the image to stabilize.
    var STEP_TIME = 2000;
    
    autoTester.addStep(false,
        function () {
        }, STEP_TIME
    );

    autoTester.addStep(true,
        function () {
            Entities.deleteEntity(terrain);
            Entities.deleteEntity(sky);
            
            module.exports.complete = true;
        }, STEP_TIME
    );
}
