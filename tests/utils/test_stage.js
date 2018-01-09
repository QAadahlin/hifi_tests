// Test content stage

// This script generate a stage made of a dark zone with no lighting, haze or skybox
var LIFETIME = 120;

var BACKDROP_SIZE = 16;
var BACKDROP_HALFSIZE = 8;
var BACKDROP_MIN_C = -2;

var ROOT_Z_OFFSET = -3;
var ROOT_Y_OFFSET = -0.1;

var TILE_UNIT = 1.0;
var TILE_DIM = { x: TILE_UNIT, y: TILE_UNIT, z: TILE_UNIT};

var GRID_TILE_OFFSET = Vec3.multiply(0.5, TILE_DIM);


function getTileColor(a, b, c) {
    var offset = (Math.abs(a) + ((Math.abs(b) + (Math.abs(c) % 2)) %  2)) % 2;
    var intensity = (1 - offset) * 128 + offset * 255;
    return { red: intensity, green: intensity, blue: intensity };
}

function addTile(a, b, c) {
    var center = Vec3.sum(stageTileRoot, Vec3.multiply(a, stageAxisA));
    center = Vec3.sum(center, Vec3.multiply(b, stageAxisB));
    center = Vec3.sum(center, Vec3.multiply(c, stageAxisC));                                           

    return (Entities.addEntity({
        type: "Shape",
        shape: "Cube",
        name: "Backdrop",
        color: getTileColor(a, b, c),
        position: center,    
        rotation: stageOrientation,    
        dimensions: TILE_DIM,
        lifetime: LIFETIME,
        
    }));
}

function addBackdropGrid(backdrop) {
    for (i = BACKDROP_HALFSIZE; i > -BACKDROP_HALFSIZE; i--) {
        for (j = -BACKDROP_HALFSIZE; j < BACKDROP_HALFSIZE; j++) {
            backdrop.push(addTile(i, j, BACKDROP_MIN_C));
        }
    }

    for (i = -1; i < BACKDROP_HALFSIZE; i++) {
         for (j = -BACKDROP_HALFSIZE; j < BACKDROP_HALFSIZE; j++) {
            backdrop.push(addTile(BACKDROP_HALFSIZE, j, i));
        }
    }
}

function addZone(hasKeyLight, hasAmbient) {
    var zoneDim = Vec3.multiply(BACKDROP_SIZE, TILE_DIM);
    var center = getStagePosOriAt(0, 0, 0).pos;
    
    var lightDir = Vec3.normalize(Vec3.sum(Vec3.multiply(-1, Quat.getUp(stageOrientation)), Vec3.multiply(-1, Quat.getRight(stageOrientation))))

    return (Entities.addEntity({
        type: "Zone",
        name: "Backdrop zone",
  
        position: center,    
        rotation: stageOrientation,    
        dimensions: zoneDim,
        lifetime: LIFETIME,
  
        keyLight:{
            intensity: 0.8 * hasKeyLight,
            direction: {
                "x": 0.037007175385951996,
                "y": -0.7071067690849304,
                "z": -0.7061376571655273
            },
            ambientIntensity: 0.5 * hasAmbient,
            ambientURL: "https://github.com/highfidelity/hifi_tests/blob/master/assets/skymaps/Sky_Day-Sun-Mid-photo.ktx?raw=true",
        },

        hazeMode:"disabled",
        backgroundMode:"skybox",
        skybox:{
            color: {"red":2,"green":2,"blue":2}, // Dark grey background
        }
    }));
}

function addTestBackdrop(name, hasKeyLight, hasAmbient) {
    var backdrop = [];

    addBackdropGrid(backdrop);
    backdrop.push(addZone(hasKeyLight,hasAmbient));

    return backdrop;
}

// Stage position and orientation initialised at setup
stageOrientation = Quat.fromPitchYawRollDegrees(0.0, 0.0, 0.0);
stageRoot = {"x":0.0,"y":0.0,"z":0.0};
stageTileRoot = {"x":0.0,"y":0.0,"z":0.0};
stageAxisA = Vec3.multiply(TILE_UNIT, Quat.getForward(stageOrientation));
stageAxisB = Vec3.multiply(TILE_UNIT, Quat.getRight(stageOrientation));
stageAxisC = Vec3.multiply(TILE_UNIT, Quat.getUp(stageOrientation));

setupStage = function (hasKeyLight, hasAmbient) {
    MyAvatar.orientation = Quat.fromPitchYawRollDegrees(0.0, 0.0, 0.0);
    var orientation = MyAvatar.orientation;
    orientation = Quat.safeEulerAngles(orientation);
    orientation.x = 0;
    orientation = Quat.fromVec3Degrees(orientation);

    stageOrientation = orientation;
    stageAxisA = Vec3.multiply(TILE_UNIT, Quat.getForward(stageOrientation));
    stageAxisB = Vec3.multiply(TILE_UNIT, Quat.getRight(stageOrientation));
    stageAxisC = Vec3.multiply(TILE_UNIT, Quat.getUp(stageOrientation));   

    stageRoot = Vec3.sum(MyAvatar.position, Vec3.multiply(-ROOT_Z_OFFSET, Quat.getForward(orientation)));
    stageRoot = Vec3.sum(stageRoot, Vec3.multiply(ROOT_Y_OFFSET, Quat.getUp(orientation)));
    stageTileRoot = Vec3.sum(stageRoot, GRID_TILE_OFFSET);

    return addTestBackdrop("Light_stage_backdrop", hasKeyLight, hasAmbient);
}

getStagePosOriAt = function (a, b, c) {    
    var center = Vec3.sum(stageRoot, Vec3.multiply(a, stageAxisA));
    center = Vec3.sum(center, Vec3.multiply(b, stageAxisB));
    center = Vec3.sum(center, Vec3.multiply(c, stageAxisC));                                           

    return { "pos": center, "ori": stageOrientation};
}