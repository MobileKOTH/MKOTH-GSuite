import { EntitySet } from './entitySystem';

export interface IQueryOperation
{
    type: "all", // TODO: one, some
    expression?: string
}

function getCacheKey(sheetName: string)
{
    return "entity_cache-" + sheetName.toLowerCase()
}

export function clearCache(sheetName: string)
{
    CacheService.getScriptCache()?.remove(getCacheKey(sheetName))
}

function putZippedCache(key: string, value: string)
{
    CacheService.getScriptCache()?.put(key, Utilities.base64Encode(Utilities.gzip(Utilities.newBlob(value)).getBytes()))
}

function getZippedCache(key: string)
{
    const zipped = CacheService.getScriptCache()?.get(key)
    if (!zipped) {
        return null;
    }
    return Utilities.ungzip(Utilities.newBlob(Utilities.base64Decode(zipped), "application/x-gzip")).getDataAsString()
}

export function handleGet(operation: IQueryOperation, spreadSheet: GoogleAppsScript.Spreadsheet.Spreadsheet, sheetName: string)
{
    const cacheKey = getCacheKey(sheetName);
    switch (operation.type)
    {
        case "all": {
            let data = getZippedCache(cacheKey)

            if (data)
            {
                return data
            }

            data = JSON.stringify(new EntitySet({ spreadSheet, tableName: sheetName }).loadAll())
            putZippedCache(cacheKey, data)

            return data
        }
        default:
            return JSON.stringify(null)
    }
}

export function handlePost(operation: IQueryOperation, postData: string, spreadSheet: GoogleAppsScript.Spreadsheet.Spreadsheet, sheetName: string)
{
    clearCache(sheetName)
    switch (operation.type)
    {
        case "all": {
            const data = JSON.parse(postData)
            const entitySet = new EntitySet({ spreadSheet, tableName: sheetName })
            entitySet.updateAll(data)
            return JSON.stringify({ status: "ok" })
        }
        default:
            return JSON.stringify(null)
    }
}
