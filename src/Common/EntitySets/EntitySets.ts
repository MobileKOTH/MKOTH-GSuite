namespace MKOTHGSuite.EntitySets
{
    import EntitySet = EntitySystem.EntitySet;
    import PlayerEntity = MKOTHGSuite.Models.PlayerEntity;
    import SeriesEnitity = MKOTHGSuite.Models.SeriesEntity;

    export function GetInternalPlayerEntitySet() 
    {
        return new EntitySet<PlayerEntity>(
            {
                spreadSheet: getInternalSpreadSheet(),
                tableName: "_playerTable"
            });
    }

    export function GetExternalPlayerEntitySet()
    {
        return new EntitySet<PlayerEntity>(
            {
                spreadSheet: getExternalSpreadSheet(),
                tableName: "_playerTable"
            })
    }

    export function GetInternalSeriesEntitySet()
    {
        return new EntitySet<SeriesEnitity>(
            {
                spreadSheet: getInternalSpreadSheet(),
                tableName: "_seriesTable"
            })
    }

    export function GetExternalSeriesEntitySet()
    {
        return new EntitySet<SeriesEnitity>(
            {
                spreadSheet: getExternalSpreadSheet(),
                tableName: "_seriesTable"
            })
    }
}