namespace EntitySystem
{
    import Spreadsheet = GoogleAppsScript.Spreadsheet.Spreadsheet;

    export interface IEntity
    {
        id: string;
    }

    interface entitySetOptions
    {
        spreadSheet: Spreadsheet
        tableName: string
    }

    export class EntitySet<T extends IEntity>
    {
        public readonly spreadSheet: Spreadsheet
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
            return Updater.updateEntities(this.spreadSheet, this.tableName, entities)
        }
    }

    class Loader
    {
        public static loadEntities<T extends IEntity>(spreadSheet: Spreadsheet, tableName: string): T[]
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
        public static updateEntities<T extends IEntity>(spreadSheet: Spreadsheet, tableName: string, entities: T[])
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

function test_entitySystemTest()
{
    var newPlayerSet = Array<MKOTHGSuite.Models.PlayerEntity>();
    PlayerList.forEach(x =>
    {
        var playerEntity = new MKOTHGSuite.Models.PlayerEntity();
        playerEntity.id = Tools.ComputeMD5Hash(x.name + x.joinDate);
        playerEntity.name = x.name;
        playerEntity.joinDate = x.joinDate;
        playerEntity.class = x.class;
        newPlayerSet.push(playerEntity);
    });

    MKOTHGSuite.EntitySets.GetPlayerEntitySet().update(newPlayerSet);
}
