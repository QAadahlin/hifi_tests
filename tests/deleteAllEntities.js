// Warn if we cannot delete entities
if (!Entities.canAdjustLocks()) {
    Window.alert("You do not have permission to make changes.");
} else {
    // Find all entities around me
    var center = MyAvatar.position;
    var radius = 40000;
    var entityList = Entities.findEntities(center, radius);

    // Delete these entities
    for (var i = 0; i < entityList.length; i++) {
        Entities.editEntity(entityList[i], {locked: false});
        Entities.deleteEntity(entityList[i]);
    }
}
