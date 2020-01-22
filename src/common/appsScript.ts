export function getAndCache(key: string, loader: () => string)
{
    const value = loader()
    CacheService.getScriptCache()?.put(key, value)
    return value
}
