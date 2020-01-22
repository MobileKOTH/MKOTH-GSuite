import { IEntity } from "./entitySystem";

export function loadEntities<T extends IEntity>(spreadSheet: GoogleAppsScript.Spreadsheet.Spreadsheet, tableName: string): T[]
{
    const tableSheet = spreadSheet.getSheetByName(tableName);

    if (!tableSheet)
    {
        return []
    }
    const rows = tableSheet.getLastRow();
    const columns = tableSheet.getLastColumn();
    const range = tableSheet.getRange(1, 1, rows, columns);
    const values = range.getValues();
    const propertyNames = values.shift() ?? [];

    return values.map(x => loadEntity(propertyNames, x));
}

function loadEntity<T extends IEntity>(propertyNames: string[], row: any[]): T
{
    let entity: { [key: string]: string } = {};

    for (let propertyNameIndex = 0; propertyNameIndex < propertyNames.length; propertyNameIndex++)
    {
        entity[propertyNames[propertyNameIndex]] = row[propertyNameIndex];
    }

    return entity as T;
}
