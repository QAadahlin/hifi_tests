function tests_content_entity_zone_create() {
    var localTestNumber = testNumber;
    
    // Enabled draw zone bounding box and stack to visualize the stack of zone components
    Render.getConfig("RenderMainView.DrawZoneStack").enabled = true
    Render.getConfig("RenderMainView.DrawZones").enabled = true

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
    properties = Entities.getEntityProperties(zone);

    // Setup snapshots
    //    resolvePath(".") returns a string that looks like <path to High Fidelity resource folder> + "file:/" + <current folder>
    //    We need the current folder
    var combinedPath = Script.resolvePath(".");
    var path = combinedPath.substring(combinedPath.indexOf(":") + 4);
    Snapshot.setSnapshotsLocation(path);

    // Note that the image for the current step is snapped at the beginning of the next step.
    // This is because it may take a while for the image to stabilize.
    var STEP_TIME = 2000;
    var step = 1;
    Script.setTimeout(
        function() {
            // Give user time to move mouse cursor out of window
        }, 
          
        step * STEP_TIME
    );

    step +=1;
    Script.setTimeout(
        function() {
            Window.takeSnapshot();

            MyAvatar.position  = {x: avatarOriginPosition.x, y: avatarOriginPosition.y, z: avatarOriginPosition.z - 7.5};
            
            var newProperty = { 
              position: {x: MyAvatar.position.x + OBJ_DX, y: MyAvatar.position.y + OBJ_DY, z: MyAvatar.position.z + OBJ_DZ}
            };
            Entities.editEntity(object, newProperty);  
        }, 
          
        step * STEP_TIME
    );
      
    // clean up after test (done in 2 steps)
    step += 1;
    Script.setTimeout(
      function () {
          Window.takeSnapshot();
          deleteEntities();
      },
      
      step * STEP_TIME
    );
    step += 1;
    Script.setTimeout(
      function () {
          // Exit script if not running autoTester
          if (typeof testNumber == 'undefined') {
              Script.stop();
          } else {
              testNumber = localTestNumber + 1;
          }
      },
      
      step * STEP_TIME
    );
}

if (typeof testNumber == 'undefined') {
    tests_content_entity_zone_create();
}