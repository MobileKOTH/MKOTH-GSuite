import { RequestGetBase, RequestPostBase, Helpers } from "../../lib/app-script-router";
import { getAndCache } from "../common/appsScript";
import { RootQuery } from "./root";

type AdminRequestParam = {
    admin?: string
    [key: string]: string | undefined
}

type AdminParam = {
    isAdmin?: boolean
}

type AnyRequest = RequestGetBase<AdminRequestParam> | RequestPostBase<AdminRequestParam>

export type AdminRequest<T extends AnyRequest> = T & AdminParam

export function administer<T extends AnyRequest>(request: AdminRequest<T>)
{
    const adminKey = "adminKey"
    if (request.parameter.admin)
    {
        let adminKeyValue = CacheService.getScriptCache()?.get(adminKey) ?? getAndCache(adminKey, () => PropertiesService.getScriptProperties().getProperty(adminKey) as string)
        request.isAdmin = request.parameter.admin === adminKeyValue
    }
    return request
}


RootQuery.token =
{
    get(request: RequestGetBase<any> & AdminParam)
    {
        if (!request.isAdmin)
        {
            return Helpers.returnUnauthorised()
        }
        return Helpers.returnJSON({ token: ScriptApp.getOAuthToken() })
    }
}
