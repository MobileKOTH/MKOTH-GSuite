var EntitySet = EntitySystem.EntitySet;
var PlayerEntitySet = new EntitySet({
    spreadSheet: SpreadsheetApp.getActive(),
    tableName: "_PlayerTable"
});
var PlayerEntities = PlayerEntitySet.load();
