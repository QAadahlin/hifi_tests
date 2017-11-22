// Enabled draw zone bounding box and stack to visualize the stack of zone components
Render.getConfig("RenderMainView.DrawZoneStack").enabled = false

// Test material matrix
Script.include("../../stage.js?raw=true")

// Add the test Cases
var createdEntities = setupStage()

var posOri = getStagePosOriAt(6.9, 0, 4)
var lightOri = Quat.multiply(Quat.fromPitchYawRollDegrees(-90, 0, 0), posOri.ori);

// Define zone properties
var properties = {
  lifetime: 120,  
  type: "light",  
  name: "test create spot light",
  position: posOri.pos,
  rotation: lightOri,

  type: "Light",
  isSpotlight: true,
  color: { red: 255, green: 255, blue: 255 },
  intensity: 2.0,
  falloffRadius: 6.0,
  exponent: 0.1,
  cutoff: 45,
  dimensions: { x: 8.0, y: 8.0, z: 12.0 }, 
};

// Add the sphere and check its properties
var light = Entities.addEntity(properties);
createdEntities.push(light);

var posOri2 = getStagePosOriAt(6.9, 4, 4)
var lightOri2 = Quat.multiply(Quat.fromPitchYawRollDegrees(-45, 90, 0), posOri.ori);

properties = {
    lifetime: 120,  
    type: "light",  
    name: "test create spot light",
    position: posOri2.pos,
    rotation: lightOri2,
  
    type: "Light",
    isSpotlight: true,
    color: { red: 255, green: 125, blue: 255 },
    intensity: 2.0,
    falloffRadius: 6.0,
    exponent: 1,
    cutoff: 20,
    dimensions: { x: 8.0, y: 8.0, z: 12.0 }, 
  };
  createdEntities.push(Entities.addEntity(properties));

properties = Entities.getEntityProperties(light);
print("Light added :" + light);
print(JSON.stringify(properties));

createdEntities.push(light);


// clean up after test
Script.scriptEnding.connect(function () {
    for (var i = 0; i < createdEntities.length; i++) {
        Entities.deleteEntity(createdEntities[i]);
    }
});