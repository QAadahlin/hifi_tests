var test = Script.require("./test.js");
test.test("step by step");
         
 // clean up after test
Script.scriptEnding.connect(function () {
    for (var i = 0; i < createdEntities.length; i++) {
        Entities.deleteEntity(createdEntities[i]);
    }
    resetConfig("contextOverlayHighlightList");
    resetConfig("highlightList1");
    resetConfig("highlightList2");
});    
