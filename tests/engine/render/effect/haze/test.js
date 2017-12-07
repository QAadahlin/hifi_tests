module.exports.complete = false;

module.exports.test = function () {
    var autoTester = Script.require("../../../../utils/autoTester.js");

    // Load terrain
    var position =  MyAvatar.position;
    position.x = position.x - 5000.0;
    position.y = position.y + 20.0;

    var TERRAIN_URL = Script.resolvePath('./Nevada-Moon-Rocks.baked.fbx');
    var table = Entities.addEntity({
        type: 'Model',
        name: 'Terrain',
        modelURL: TERRAIN_URL,
        shapeType: 'box',
        dimensions: { x: 10000.0, y: 600.0, z: 10000.0 },
        position: position
    });

    var camera = autoTester.setupSnapshots(Script.resolvePath("."));
    var spectatorCameraConfig = Render.getConfig("SecondaryCamera");
	spectatorCameraConfig.position = {x: avatarOriginPosition.x, y: avatarOriginPosition.y + 0.6, z: avatarOriginPosition.z};
    
    // Note that the image for the current step is snapped at the beginning of the next step.
    // This is because it may take a while for the image to stabilize.
    var STEP_TIME = 2000;
    
    autoTester.addStep(true,
        function () {
        }, STEP_TIME
    );

    autoTester.addStep(false,
        function () {
            Entities.deleteEntity(terrain);
            
            module.exports.complete = true;
        }, STEP_TIME
    );
}
