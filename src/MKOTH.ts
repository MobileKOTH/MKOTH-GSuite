import './web-app/ping'

import { RequestGetBase, Handler } from "./app-script-router"
import { RoutingRoot } from "./web-app/root"

export function doGet(request: RequestGetBase<any>)
{
    return new Handler(RoutingRoot).handleGet(request)
}

export function doPost(request: RequestGetBase<any>)
{
    return new Handler(RoutingRoot).handleGet(request)
}