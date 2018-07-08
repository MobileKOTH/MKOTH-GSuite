import EntitySet = EntitySystem.EntitySet;

var PlayerEntitySet = new EntitySet<PlayerEntity>(
    {
        spreadSheet: SpreadsheetApp.getActive(),
        tableName: "_PlayerTable"
    });

var PlayerEntities = PlayerEntitySet.load();