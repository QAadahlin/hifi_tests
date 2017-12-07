module.exports.complete = false;

module.exports.test = function() {
    var autoTester = Script.require("../../../../utils/autoTester.js");
    
    // Enabled draw zone bounding box and stack to visualize the stack of zone components
    Render.getConfig("RenderMainView.DrawZoneStack").enabled = true;
    Render.getConfig("SecondaryCameraJob.DrawZoneStack").enabled = true;
    Render.getConfig("RenderMainView.DrawZones").enabled = true;
    Render.getConfig("SecondaryCameraJob.DrawZones").enabled = true;
    
    var avatarOriginPosition = MyAvatar.position;
    avatarOriginPosition.x = Math.round(avatarOriginPosition.x);
    avatarOriginPosition.y = Math.round(avatarOriginPosition.y);
    avatarOriginPosition.z = Math.round(avatarOriginPosition.z);

    var zone1Position = { x: avatarOriginPosition.x, y: avatarOriginPosition.y + 0.01, z: avatarOriginPosition.z + 0.0};
    var zone2Position = { x: avatarOriginPosition.x, y: avatarOriginPosition.y + 0.02, z: avatarOriginPosition.z + 8.0};
    var zone3Position = { x: avatarOriginPosition.x, y: avatarOriginPosition.y + 0.03, z: avatarOriginPosition.z + 0.0};
    var zone4Position = { x: avatarOriginPosition.x, y: avatarOriginPosition.y + 0.04, z: avatarOriginPosition.z + 0.0};

    var zone1Dimensions = { x: 20.0, y: 10.0, z: 40.0};
    var zone2Dimensions = { x: 30.0, y: 10.0, z: 20.0};
    var zone3Dimensions = { x: 10.0, y: 10.0, z: 30.0};
    var zone4Dimensions = { x:  6.0, y: 10.0, z: 20.0};

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
        keyLight:{"color": {"red":150,"green":150,"blue":0}},
        backgroundMode:"skybox",
        skybox:{"color":{"red":150,"green":150,"blue":0}}
    };
    var zone2 = Entities.addEntity(zone2properties);

    var zone3properties = {
        type: "Zone",
        name: "zone 3",
        position: zone3Position,
        dimensions: zone3Dimensions,
        keyLight:{"color": {"red":0,"green":200,"blue":0}},
        backgroundMode:"skybox",
        skybox:{"color":{"red":0,"green":200,"blue":0}}
    };
    var zone3 = Entities.addEntity(zone3properties);

    var zone4properties = {
        type: "Zone",
        name: "zone 4",
        position: zone4Position,
        dimensions: zone4Dimensions,
        keyLight:{"color": {"red":0,"green":0,"blue":200}},
        backgroundMode:"skybox",
        skybox:{"color":{"red":0,"green":0,"blue":200}}
    };
    var zone4 = Entities.addEntity(zone4properties);

    // Show zone positions on the ground
    var marker1Dimensions = { x: 20.0, y: 0.01, z: 40.0};
    var marker2Dimensions = { x: 30.0, y: 0.01, z: 20.0};
    var marker3Dimensions = { x: 10.0, y: 0.01, z: 30.0};
    var marker4Dimensions = { x:  6.0, y: 0.01, z: 20.0};

    var marker1properties = {
        type: "Box",
        name: "marker 1",
        position: zone1Position,
        dimensions: marker1Dimensions,
        "color": {"red":200,"green":0,"blue":0},
        visible: true
    };
    var marker1 = Entities.addEntity(marker1properties);

    var marker2properties = {
        type: "Box",
        name: "marker 2",
        position: zone2Position,
        dimensions: marker2Dimensions,
        "color": {"red":150,"green":150,"blue":0},
        visible: true
    };
    var marker2 = Entities.addEntity(marker2properties);

    var marker3properties = {
        type: "Box",
        name: "marker 3",
        position: zone3Position,
        dimensions: marker3Dimensions,
        "color": {"red":0,"green":200,"blue":0},
        visible: true
    };
    var marker3 = Entities.addEntity(marker3properties);

    var marker4properties = {
        type: "Box",
        name: "marker 4",
        position: zone4Position,
        dimensions: marker4Dimensions,
        "color": {"red":0,"green":0,"blue":200},
        visible: true
    };
    var marker4 = Entities.addEntity(marker4properties);

    // Move avatar 20 metres back
    MyAvatar.position.z  = avatarOriginPosition.z -20.0;
    
    var camera = autoTester.setupSnapshots(Script.resolvePath("."));
    var spectatorCameraConfig = Render.getConfig("SecondaryCamera");
    spectatorCameraConfig.orientation = {x: 0.0, y: 1.0, z: 0.0, w: 0.0};
    
    // Note that the image for the current step is snapped at the beginning of the next step.
    // This is because it may take a while for the image to stabilize.
    var STEP_TIME = 2000;
    var step = 1;
    Script.setTimeout(
        function() {
            spectatorCameraConfig.position = {x: avatarOriginPosition.x, y: avatarOriginPosition.y + 0.6, z: avatarOriginPosition.z};
        }, 
        
      step * STEP_TIME
    );

    step += 1;
    Script.setTimeout(
        function() {
            Window.takeSecondaryCameraSnapshot();

            // Position avatar
            MyAvatar.position  = {x: avatarOriginPosition.x + 7.0, y: avatarOriginPosition.y + 1.0, z: avatarOriginPosition.z - 19.0};
            spectatorCameraConfig.position = {x: avatarOriginPosition.x + 7.0, y: avatarOriginPosition.y + 1.0 + 0.6, z: avatarOriginPosition.z - 19.0};
        }, 
          
        step * STEP_TIME
    );

    step += 1;
    Script.setTimeout(
        function() {
            Window.takeSecondaryCameraSnapshot();

            // Position avatar
            MyAvatar.position  = {x: avatarOriginPosition.x + 4.0, y: avatarOriginPosition.y + 1.0, z: avatarOriginPosition.z - 11.0};
            spectatorCameraConfig.position = {x: avatarOriginPosition.x + 4.0, y: avatarOriginPosition.y + 1.0 + 0.6, z: avatarOriginPosition.z - 11.0};
        }, 
          
        step * STEP_TIME
    );

    step += 1;
    Script.setTimeout(
        function() {
            Window.takeSecondaryCameraSnapshot();

            // Position avatar
            MyAvatar.position  = {x: avatarOriginPosition.x + 1.0, y: avatarOriginPosition.y + 1.0, z: avatarOriginPosition.z - 5.0};
            spectatorCameraConfig.position  = {x: avatarOriginPosition.x + 1.0, y: avatarOriginPosition.y + 1.0 + 0.6, z: avatarOriginPosition.z - 5.0};
        }, 
          
        step * STEP_TIME
      );

    step += 1;
    Script.setTimeout(
        function() {
            Window.takeSecondaryCameraSnapshot();

            // Position avatar
            MyAvatar.position  = {x: avatarOriginPosition.x + 0.0, y: avatarOriginPosition.y + 1.0, z: avatarOriginPosition.z + 4.0};
            spectatorCameraConfig.position  = {x: avatarOriginPosition.x + 0.0, y: avatarOriginPosition.y + 1.0 + 0.6, z: avatarOriginPosition.z + 4.0};
        }, 
          
        step * STEP_TIME
    );

    step += 1;
    Script.setTimeout(
        function() {
            Window.takeSecondaryCameraSnapshot();

            // Position avatar
            MyAvatar.position  = {x: avatarOriginPosition.x - 4.0, y: avatarOriginPosition.y + 1.0, z: avatarOriginPosition.z + 11.0};
            spectatorCameraConfig.position  = {x: avatarOriginPosition.x - 4.0, y: avatarOriginPosition.y + 1.0 + 0.6, z: avatarOriginPosition.z + 11.0};
        }, 
          
        step * STEP_TIME
    );

    step += 1;
    Script.setTimeout(
        function() {
            Window.takeSecondaryCameraSnapshot();

            // Position avatar
            MyAvatar.position  = {x: avatarOriginPosition.x - 8.0, y: avatarOriginPosition.y + 1.0, z: avatarOriginPosition.z + 15.0};
            spectatorCameraConfig.position  = {x: avatarOriginPosition.x - 8.0, y: avatarOriginPosition.y + 1.0 + 0.6, z: avatarOriginPosition.z + 15.0};
        }, 
          
        step * STEP_TIME
    );

    step += 1;
    Script.setTimeout(
        function() {
            Window.takeSecondaryCameraSnapshot();

            // Position avatar
            MyAvatar.position  = {x: avatarOriginPosition.x - 13.0, y: avatarOriginPosition.y + 1.0, z: avatarOriginPosition.z + 16.0};
            spectatorCameraConfig.position  = {x: avatarOriginPosition.x - 13.0, y: avatarOriginPosition.y + 1.0 + 0.6, z: avatarOriginPosition.z + 16.0};
        }, 
          
        step * STEP_TIME
    );

    step += 1;
    Script.setTimeout(
        function() {
            Window.takeSecondaryCameraSnapshot();

            // Position avatar
            MyAvatar.position  = {x: avatarOriginPosition.x + 8.0, y: avatarOriginPosition.y + 1.0, z: avatarOriginPosition.z + 19.0};
            spectatorCameraConfig.position  = {x: avatarOriginPosition.x + 8.0, y: avatarOriginPosition.y + 1.0 + 0.6, z: avatarOriginPosition.z + 19.0};
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
      
    // Clean up after test
    step += 1;
    Script.setTimeout(
        function () {
            Entities.deleteEntity(marker1);
            Entities.deleteEntity(marker2);
            Entities.deleteEntity(marker3);
            Entities.deleteEntity(marker4);
            Entities.deleteEntity(zone1);
            Entities.deleteEntity(zone2);
            Entities.deleteEntity(zone3);
            Entities.deleteEntity(zone4);
          
            MyAvatar.position  = {x: avatarOriginPosition.x, y: avatarOriginPosition.y, z: avatarOriginPosition.z};
            spectatorCameraConfig.position = {x: avatarOriginPosition.x, y: avatarOriginPosition.y + 0.6, z: avatarOriginPosition.z};
          
            Render.getConfig("RenderMainView.DrawZoneStack").enabled = false;
            Render.getConfig("SecondaryCameraJob.DrawZoneStack").enabled = false;
            Render.getConfig("RenderMainView.DrawZones").enabled = false;
            Render.getConfig("SecondaryCameraJob.DrawZones").enabled = false;

            module.exports.complete = true;
        },
      
      step * STEP_TIME
    );
}
