import { IEntity } from "./entitySystem";

export function updateEntities<T extends IEntity>(spreadSheet: GoogleAppsScript.Spreadsheet.Spreadsheet, tableName: string, entities: T[])
{
    let tableSheet = spreadSheet.getSheetByName(tableName);

    if (!tableSheet)
    {
        tableSheet = spreadSheet.insertSheet(tableName)
    }

    const keys = Object.keys(entities[0]);
    const rows = entities.length + 1;
    const columns = keys.length;
    const range = tableSheet.getRange(1, 1, rows, columns);

    tableSheet.clearContents();
    return range.setValues([keys, ...entities.map(x => generateEntityRow(x))]);
}

function generateEntityRow<T extends IEntity>(entity: T)
{
    return Object.values(entity);
}
