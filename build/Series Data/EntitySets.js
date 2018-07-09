var MKOTHGSuite;
(function (MKOTHGSuite) {
    var EntitySets;
    (function (EntitySets) {
        var EntitySet = EntitySystem.EntitySet;
        function GetPlayerEntitySet() {
            return new EntitySet({
                spreadSheet: SpreadsheetApp.getActive(),
                tableName: "_PlayerTable"
            });
        }
        EntitySets.GetPlayerEntitySet = GetPlayerEntitySet;
        function GetSeriesEntitySet() {
            return new EntitySet({
                spreadSheet: SpreadsheetApp.getActive(),
                tableName: "_SeriesTable"
            });
        }
        EntitySets.GetSeriesEntitySet = GetSeriesEntitySet;
    })(EntitySets = MKOTHGSuite.EntitySets || (MKOTHGSuite.EntitySets = {}));
})(MKOTHGSuite || (MKOTHGSuite = {}));
