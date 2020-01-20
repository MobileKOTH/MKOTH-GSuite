import './ping'

import { RequestGetBase, Handler, Router, Helpers, RequestPostBase } from "../app-script-router"
import { RoutingRoot } from "./root"

export function doGet(request: RequestGetBase<any>)
{
    return new Handler(RoutingRoot).handleGet(request)
}

export function doPost(request: RequestGetBase<any>)
{
    return new Handler(RoutingRoot).handleGet(request)
}