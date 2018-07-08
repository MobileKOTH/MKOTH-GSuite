import EntitySet = EntitySystem.EntitySet;

var PlayerSet = new EntitySet<PlayerEntity>(
    {
        spreadSheet: SpreadsheetApp.getActive(),
        tableName: "_PlayerTable"
    });

var PlayerEntities = PlayerSet.load();