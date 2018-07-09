namespace MKOTHGSuite.EntitySets
{
    import EntitySet = EntitySystem.EntitySet;
    import PlayerEntity = MKOTHGSuite.Models.PlayerEntity;
    import SeriesEnitity = MKOTHGSuite.Models.SeriesEntity;

    export function GetPlayerEntitySet() 
    {
        return new EntitySet<PlayerEntity>(
            {
                spreadSheet: SpreadsheetApp.getActive(),
                tableName: "_PlayerTable"
            });
    }

    export function GetSeriesEntitySet()
    {
        return new EntitySet<SeriesEnitity>(
            {
                spreadSheet: SpreadsheetApp.getActive(),
                tableName: "_SeriesTable"
            })
    }
}