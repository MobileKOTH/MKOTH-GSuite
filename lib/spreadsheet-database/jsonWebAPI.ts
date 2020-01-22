import { EntitySet } from './entitySystem';

export interface IQueryOperation
{
    type: "all", // TODO: one, some
    expression?: string
}

function getCacheKey(name: string)
{
    return "entity_cache-" + name
}

export function handleGet(operation: IQueryOperation, spreadSheet: GoogleAppsScript.Spreadsheet.Spreadsheet, sheetName: string)
{
    const cache = CacheService.getScriptCache() as GoogleAppsScript.Cache.Cache
    const cacheKey = getCacheKey(sheetName);
    switch (operation.type)
    {
        case "all": {
            let data = cache.get(cacheKey)

            if (data)
            {
                return data
            }

            data = JSON.stringify(new EntitySet({ spreadSheet, tableName: sheetName }).loadAll())
            cache.put(cacheKey, data)

            return data
        }
        default:
            return JSON.stringify(null)
    }
}

export function handlePost(operation: IQueryOperation, postData: string, spreadSheet: GoogleAppsScript.Spreadsheet.Spreadsheet, sheetName: string)
{
    CacheService.getScriptCache()?.remove(getCacheKey(sheetName))
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
