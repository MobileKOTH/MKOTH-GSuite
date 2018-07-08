namespace EntitySystem
{
    export interface IEntity
    {
        id: string;
    }

    interface entitySetOptions
    {
        spreadSheet: GoogleAppsScript.Spreadsheet.Spreadsheet
        tableName: string
    }

    export class EntitySet<T extends IEntity>
    {
        public readonly spreadSheet: GoogleAppsScript.Spreadsheet.Spreadsheet;
        public readonly tableName: string;

        constructor(options: entitySetOptions)
        {
            this.spreadSheet = options.spreadSheet;
            this.tableName = options.tableName;
        }

        load()
        {
            return Loader.loadEntities<T>(this.spreadSheet, this.tableName);
        }

        update(entities: T[])
        {
            Updater.updateEntities(this.spreadSheet, this.tableName, entities)
        }
    }

    class Loader
    {
        public static loadEntities<T extends IEntity>(spreadSheet: GoogleAppsScript.Spreadsheet.Spreadsheet, tableName: string): T[]
        {
            var tableSheet = spreadSheet.getSheetByName(tableName);
            var rows = tableSheet.getLastRow();
            var columns = tableSheet.getLastColumn();
            var range = tableSheet.getRange(1, 1, rows, columns);
            var values = range.getValues();
            var propertyNames = values.shift();

            var entities = new Array<T>();

            for (var key in values)
            {
                if (values.hasOwnProperty(key))
                {
                    var element = values[key];
                    var entity = Loader.loadEntity<T>(propertyNames, element);
                    entities.push(entity);
                }
            }

            return entities;
        }

        private static loadEntity<T extends IEntity>(propertyNames, row): T
        {
            var entity = {};

            for (var propertyNameIndex = 0; propertyNameIndex < propertyNames.length; propertyNameIndex++)
            {
                entity[propertyNames[propertyNameIndex]] = row[propertyNameIndex];
            }

            return entity as T;
        }
    }

    class Updater
    {
        public static updateEntities<T extends IEntity>(spreadSheet: GoogleAppsScript.Spreadsheet.Spreadsheet, tableName: string, entities: T[])
        {
            var tableSheet = spreadSheet.getSheetByName(tableName);
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
                    var rowValues = Updater.generateEntityRow(element);

                    values.push(rowValues);
                }
            }

            tableSheet.clearContents();
            return range.setValues(values);
        }

        private static generateEntityRow<T extends IEntity>(entity: T): string[]
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


namespace Obsolete
{
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

        PlayerKeyEntity: function ()
        {
            this.playerId = "";
            this.key = 0;
        },

        SeriesEntity: function ()
        {
            this.date = new Date();
            this.type = "";
            this.player1Id = "";
            this.player2Id = "";
            this.player1Wins = 0;
            this.player2Wins = 0;
            this.draws = 0;
            this.gameInviteCode = "";
        },

        RawSeriesEntity: function ()
        {
            this.date = new Date();
            this.type = "";
            this.player1Name = "";
            this.player2Name = "";
            this.player1Wins = 0;
            this.player2Wins = 0;
            this.draws = 0;
            this.submissionKey = 0;
            this.maths1 = "";
            this.maths2 = "";
            this.maths3 = "";
            this.gameInviteCode = "";
        }
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
                return EntitySystem.Updater.updateEntities(sheetApp, tableName, entities);
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
                return EntitySystem.Updater.updateEntities(sheetApp, tableName, entities);
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
                return range.setValues(values);
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
}
