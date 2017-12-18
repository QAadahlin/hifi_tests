var spectatorCameraConfig;

module.exports.setupSnapshots = function (combinedPath) {
    // Hide the avatar
    MyAvatar.setEnableMeshVisible(false);
    
    // Zero the head position
    MyAvatar.bodyYaw = 0.0;
    MyAvatar.bodyPitch = 0.0;
    MyAvatar.bodyRoll = 0.0;
    MyAvatar.headYaw = 0.0;
    MyAvatar.headPitch = 0.0;
    MyAvatar.headRoll = 0.0;
    
    //    resolvePath(".") returns a string that looks like "file:/" + <current folder>
    //    We need the current folder
    var path = combinedPath.substring(combinedPath.indexOf(":") + 4);
    Snapshot.setSnapshotsLocation(path);

    spectatorCameraConfig = Render.getConfig("SecondaryCamera");
    spectatorCameraConfig.enableSecondaryCameraRenderConfigs(true);
    spectatorCameraConfig.resetSizeSpectatorCamera(1920, 1080);
    spectatorCameraConfig.vFoV = 45;
    Render.getConfig("SecondaryCameraJob.ToneMapping").curve = 0;
    spectatorCameraConfig.orientation = MyAvatar.orientation;
}

var step = 1;
module.exports.addStep = function (isSnapshotRequested, stepFunction, stepTime) {
    if (isSnapshotRequested) {
        Script.setTimeout(
            function () {
                Window.takeSecondaryCameraSnapshot();
                stepFunction();
            },
            step * stepTime
        );
    } else {
        Script.setTimeout(
            stepFunction,
            step * stepTime
        );
    }
    
    ++step;
}
