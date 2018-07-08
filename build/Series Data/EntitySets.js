var EntitySet = EntitySystem.EntitySet;
var PlayerSet = new EntitySet({
    spreadSheet: SpreadsheetApp.getActive(),
    tableName: "_PlayerTable"
});
var PlayerEntities = PlayerSet.load();
