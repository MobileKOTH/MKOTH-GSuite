import './web-app'

import { RequestGetBase, Handler, RequestPostBase } from "./app-script-router"
import { RoutingRoot } from "./web-app/root"

export function doGet(request: RequestGetBase<any>)
{
    return new Handler(RoutingRoot).handleGet(request)
}

export function doPost(request: RequestPostBase<any>)
{
    return new Handler(RoutingRoot).handlePost(request)
}