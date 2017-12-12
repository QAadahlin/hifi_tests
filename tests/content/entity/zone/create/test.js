module.exports.complete = false;

module.exports.test = function () {
    var autoTester = Script.require("../../../../utils/autoTester.js");

    // Look down Z axis
    MyAvatar.bodyYaw = 0.0;
    MyAvatar.bodyPitch = 0.0;
    MyAvatar.bodyRoll = 0.0;
    MyAvatar.headYaw = 0.0;
    MyAvatar.headPitch = 0.0;
    MyAvatar.headRoll = 0.0;

    // Create the zone centered at the avatar position
    var pos = MyAvatar.position;

    // As a 5 meters cube box
    var dim = { x: 5.0, y: 5.0, z: 5.0};

    // Define zone properties
    var properties = {
        lifetime: 60,  
        type: "Zone",  
        name: "test create zone",
        position: pos,
        dimensions: dim,
        keyLight:{"color": {"red":0,"green":255,"blue":0}},
        backgroundMode:"skybox",
        skybox:{"color":{"red":0,"green":0,"blue":255}}
    };

    // Add the sphere and check its properties
    var zone = Entities.addEntity(properties);

    autoTester.setupSnapshots(Script.resolvePath("."));
    var spectatorCameraConfig = Render.getConfig("SecondaryCamera");

    // Note that the image for the current step is snapped at the beginning of the next step.
    // This is because it may take a while for the image to stabilize.
    var STEP_TIME = 2000;

    autoTester.addStep(false,
        function () {
            spectatorCameraConfig.position = {x: pos.x, y: pos.y + 0.6, z: pos.z};
        }, STEP_TIME
    );
      
    // Take final snapshot
    autoTester.addStep(true,
        function () {
        }, STEP_TIME
    );
      
    // Clean up after test
    autoTester.addStep(false,
        function () {
            Entities.deleteEntity(zone);

            module.exports.complete = true;
        }, STEP_TIME
    );
}
