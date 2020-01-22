import { RequestPostBase, RequestGetBase, Router, Helpers, Routable } from "../../lib/app-script-router";

export const RoutingRoot: Routable =
{
    get(request: RequestGetBase<any>)
    {
        const subHandler = RootQuery[Object.keys(request.parameter).find(x => RootQuery[x]) as string]
        return subHandler?.get?.call(subHandler, request) ?? Helpers.returnEmpty(request)
    },
    post(request: RequestPostBase<any>)
    {
        const subHandler = RootQuery[Object.keys(request.parameter).find(x => RootQuery[x]) as string]
        return subHandler?.post?.call(subHandler, request) ?? Helpers.returnEmpty(request)
    }
}

/**
 * Plain query strings at root level will be used more often rather than the path routing above due to 
 * authentication and CORS limitation(lack of OPTIONS method for preflight) of AppsScript for public access.
 * Issue Reference: https://issuetracker.google.com/issues/133299026
 */
export const RootQuery: { [key: string]: Router<any, any> } = {} 
