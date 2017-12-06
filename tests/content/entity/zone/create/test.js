module.exports.complete = false;

module.exports.test = function () {
    var autoTester = Script.require("../../../../utils/autoTester.js");
    
    // Enabled draw zone bounding box and stack to visualize the stack of zone components
    Render.getConfig("RenderMainView.DrawZoneStack").enabled = true;
    Render.getConfig("SecondaryCameraJob.DrawZoneStack").enabled = true;
    Render.getConfig("RenderMainView.DrawZones").enabled = true;
    Render.getConfig("SecondaryCameraJob.DrawZones").enabled = true;

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

    var camera = autoTester.setupSnapshots(Script.resolvePath("."));
    var spectatorCameraConfig = Render.getConfig("SecondaryCamera");

    // Note that the image for the current step is snapped at the beginning of the next step.
    // This is because it may take a while for the image to stabilize.
    var STEP_TIME = 2000;
    var step = 1;
    Script.setTimeout(
        function() {
            spectatorCameraConfig.position = {x: pos.x, y: pos.y + 0.6, z: pos.z};
        }, 
          
        step * STEP_TIME
    );
      
    // Take final snapshot
    step += 1;
    Script.setTimeout(
      function () {
          Window.takeSecondaryCameraSnapshot();
      },
      
      step * STEP_TIME
    );
      
    // Take final snapshot and clean up after test
    step += 1;
    Script.setTimeout(
      function () {
          Entities.deleteEntity(zone);
          
          Render.getConfig("RenderMainView.DrawZoneStack").enabled = false;
          Render.getConfig("SecondaryCameraJob.DrawZoneStack").enabled = false;
          Render.getConfig("RenderMainView.DrawZones").enabled = false;
          Render.getConfig("SecondaryCameraJob.DrawZones").enabled = false;
          
          module.exports.complete = true;
      },
      
      step * STEP_TIME
    );
}
