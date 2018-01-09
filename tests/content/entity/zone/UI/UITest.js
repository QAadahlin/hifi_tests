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
 
// Look down Z axis
MyAvatar.bodyYaw   = 0.0;
MyAvatar.bodyPitch = 0.0;
MyAvatar.bodyRoll  = 0.0;
MyAvatar.headYaw   = 0.0;
MyAvatar.headPitch = 0.0;
MyAvatar.headRoll  = 0.0;

// Set up test environment
var avatarOriginPosition = MyAvatar.position;

var zoneRedPosition   = { x: avatarOriginPosition.x, y: avatarOriginPosition.y - 4.0, z: avatarOriginPosition.z - 17.5 };
var zoneBluePosition  = { x: avatarOriginPosition.x, y: avatarOriginPosition.y - 4.0, z: avatarOriginPosition.z - 17.5 };
var zoneGreenPosition = { x: avatarOriginPosition.x, y: avatarOriginPosition.y - 4.0, z: avatarOriginPosition.z - 17.5 };

var ZONE_HEIGHT = 10.0;
var zoneRedDimensions   = { x: 40.0, y: ZONE_HEIGHT, z: 40.0};
var zoneGreenDimensions = { x: 20.0, y: ZONE_HEIGHT, z: 20.0};
var zoneBlueDimensions  = { x: 10.0, y: ZONE_HEIGHT, z: 10.0};

// Create zones
var BRIGHT_SKY_URL = Script.resolvePath(prefix + '../tools/autoTester/resources/Sky_Day-Sun-Mid-photo.ktx');
var zoneRedProperties = {
    type: "Zone",
    name: "zone red",
    position: zoneRedPosition,
    dimensions: zoneRedDimensions,
    
    keyLightMode: "enabled",
    keyLight:{"color": {"red": 200,"green": 0,"blue": 0}},
    
    ambientLightMode: "enabled",
    ambientLight: {
        ambientURL: BRIGHT_SKY_URL
    },
    
    skyboxMode: "enabled",
    skybox: {
        color: {"red": 255,"green": 255,"blue": 255},
        url: BRIGHT_SKY_URL
    }
};
var zoneRed = Entities.addEntity(zoneRedProperties);

var CLOUDY_SKY_URL = Script.resolvePath(prefix + '../tools/autoTester/resources/ThickCloudsWater2.jpg');
var zoneGreenProperties = {
    type: "Zone",
    name: "zone green",
    position: zoneGreenPosition,
    dimensions: zoneGreenDimensions,
    
    keyLightMode: "enabled",
    keyLight:{"color": {"red": 0,"green": 200,"blue": 0}},

    ambientLightMode: "enabled",
    ambientLight: {
        ambientURL: CLOUDY_SKY_URL
    },
    
    skyboxMode: "enabled",
    skybox: {
        color: {"red": 255,"green": 255,"blue": 255},
        url: CLOUDY_SKY_URL
    }
};
var zoneGreen = Entities.addEntity(zoneGreenProperties);

var NIGHT_SKY_URL = Script.resolvePath(prefix + '../tools/autoTester/resources/FullMoon1024Compressed.jpg');
var zoneBlueProperties = {
    type: "Zone",
    name: "zone blue",
    position: zoneBluePosition,
    dimensions: zoneBlueDimensions,
    
    keyLightMode: "enabled",
    keyLight:{"color": {"red": 0,"green": 0,"blue": 200}},
    
    ambientLightMode: "enabled",
    ambientLight: {
        ambientURL: NIGHT_SKY_URL
    },
    
    skyboxMode:"enabled",
    skybox: {
        color: {"red":255,"green":255,"blue":255},
        url: NIGHT_SKY_URL
    }

};
var zoneBlue = Entities.addEntity(zoneBlueProperties);

// Show zone positions on the ground
var markerRedDimensions   = { x: zoneRedDimensions.x,   y: 0.01, z: zoneRedDimensions.z};
var markerGreenDimensions = { x: zoneGreenDimensions.x, y: 0.02, z: zoneGreenDimensions.z};
var markerBlueDimensions  = { x: zoneBlueDimensions.x,  y: 0.03, z: zoneBlueDimensions.z};

var markerRedProperties = {
    type: "Box",
    name: "marker red",
    position: zoneRedPosition,
    dimensions: markerRedDimensions,
    "color": {"red": 200,"green": 0,"blue": 0},
    visible: true
};
var markerRed = Entities.addEntity(markerRedProperties);

var markerGreenProperties = {
    type: "Box",
    name: "marker green",
    position: zoneGreenPosition,
    dimensions: markerGreenDimensions,
    "color": {"red": 0,"green": 150,"blue": 0},
    visible: true
};
var markerGreen = Entities.addEntity(markerGreenProperties);

var markerBlueProperties = {
    type: "Box",
    name: "marker blue",
    position: zoneBluePosition,
    dimensions: markerBlueDimensions,
    "color": {"red": 0,"green": 0,"blue": 200},
    visible: true
};
var markerBlue = Entities.addEntity(markerBlueProperties);

// Add a white sphere left of centre
var sphereProperties = {
    type: "Sphere",
    name: "sphere",
    position: {x: MyAvatar.position.x - 2.0, y: MyAvatar.position.y + 0.6, z: MyAvatar.position.z - 17.5},
    dimensions: { x: 1.0, y: 1.2, z: 1.4 },
    "color": {"red":255,"green":255,"blue":255},
    visible: true
};
var sphere = Entities.addEntity(sphereProperties);

// clean up after test
Script.scriptEnding.connect(function () {
  Entities.deleteEntity(zoneRed);
  Entities.deleteEntity(zoneGreen);
  Entities.deleteEntity(zoneBlue);
  
  Entities.deleteEntity(markerRed);
  Entities.deleteEntity(markerGreen);
  Entities.deleteEntity(markerBlue);
  
  Entities.deleteEntity(sphere);
});


