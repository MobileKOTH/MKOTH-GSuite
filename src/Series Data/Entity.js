var EntityModels =
{
    PlayerEntity: function ()
    {
        this.id = "";
        this.name = "";
        this.class = "";
        this.isKnight = false;
        this.rank = 0;
        this.points = 0;
        this.joinDate = new Date();
        this.discordId = 0;
        this.winsAll = 0;
        this.lossAll = 0;
        this.drawsAll = 0;
        this.winsMain = 0;
        this.lossMain = 0;
        this.drawsMain = 0;
        this.elo = 0;
        this.missingInProgressDays = 0;
        this.status = "";
    },

    SeriesEntity: function ()
    {
        this.date = new Date();
        this.player1Id = "";
        this.player2Id = "";
        this.player1Wins = 0;
        this.player2Wins = 0;
        this.draws = 0;
        this.gameInviteCode = "";
    },
}

var EntitySets =
{
    PlayerSet: new function ()
    {
        var sheetApp = SpreadsheetApp.getActive();
        var tableName = "_PlayerTable";
        var T = EntityModels.PlayerEntity;

        /**
         * @returns {T[]}
         */
        this.load = function ()
        {
            return EntitySystem.Loader.loadEntities(sheetApp, tableName);
        }

        /**
         * @param {T[]} entities 
         */
        this.update = function (entities)
        {
            EntitySystem.Updater.updateEntities(SpreadsheetApp.getActive(), tableName, entities);
        }
    },

    SeriesSet: new function ()
    {
        var sheetApp = SpreadsheetApp.getActive();
        var tableName = "_SeriesTable";
        var T = EntityModels.SeriesEntity;

        /**
         * @returns {T[]}
         */
        this.load = function ()
        {
            return EntitySystem.Loader.loadEntities(sheetApp, tableName);
        }

        /**
         * @param {T[]} entities 
         */
        this.update = function (entities)
        {
            EntitySystem.Updater.updateEntities(SpreadsheetApp.getActive(), tableName, entities);
        }
    }
}

var EntitySystem =
{
    Loader:
    {
        /**
         * @param {GoogleAppsScript.Spreadsheet.Spreadsheet} sheetApp
         * @param {String} tableSheetName
         */
        loadEntities: function (sheetApp, tableSheetName)
        {
            var tableSheet = sheetApp.getSheetByName(tableSheetName);
            var rows = tableSheet.getLastRow();
            var columns = tableSheet.getLastColumn();
            var range = tableSheet.getRange(1, 1, rows, columns);
            var values = range.getValues();
            var propertyNames = values.shift();

            var entities = [];

            for (var key in values)
            {
                if (values.hasOwnProperty(key))
                {
                    var element = values[key];
                    var entity = EntitySystem.Loader.loadEntity(propertyNames, element);
                    entities.push(entity);
                }
            }

            return entities;
        },

        /**
         * @param {String[]} propertyNames
         * @param {[]} row
         */
        loadEntity: function (propertyNames, row)
        {
            var entity = {};

            for (var propertyNameIndex = 0; propertyNameIndex < propertyNames.length; propertyNameIndex++)
            {
                entity[propertyNames[propertyNameIndex]] = row[propertyNameIndex];
            }

            return entity;
        }
    },

    Updater:
    {
        /**
         * @param {GoogleAppsScript.Spreadsheet.Spreadsheet} sheetApp
         * @param {String} tableSheetName
         * @param {[]} entities
         */
        updateEntities: function (sheetApp, tableSheetName, entities)
        {
            var tableSheet = sheetApp.getSheetByName(tableSheetName);
            var keys = Object.keys(entities[0]);
            var rows = entities.length + 1;
            var columns = keys.length;
            var range = tableSheet.getRange(1, 1, rows, columns);
            var values = [keys];

            for (var key in entities)
            {
                if (entities.hasOwnProperty(key))
                {
                    var element = entities[key];
                    var rowValues = EntitySystem.Updater.generateEntityRow(element);

                    values.push(rowValues);
                }
            }

            tableSheet.clearContents();
            range.setValues(values);
        },

        /**
         * @param {*} entity
         */
        generateEntityRow: function (entity)
        {
            var row = [];

            for (var key in entity)
            {
                if (entity.hasOwnProperty(key))
                {
                    var element = entity[key];
                    row.push(element);
                }
            }

            return row;
        }
    }
}
