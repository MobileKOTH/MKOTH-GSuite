//#region Polyfills
import 'core-js/features/array/from'
import 'core-js/features/array/find'
import 'core-js/features/array/includes'
import 'core-js/features/string/includes'
import 'core-js/features/object/values'
//#endregion

import './web-app'

import { Handler, RequestGetBase, RequestPostBase } from "../lib/app-script-router"
import { administer, RoutingRoot } from './web-app'
import { test } from './test'

export function doGet(request: RequestGetBase<any>)
{
    return new Handler(RoutingRoot).handleGet(administer(request))
}

export function doPost(request: RequestPostBase<any>)
{
    return new Handler(RoutingRoot).handlePost(administer(request))
}

export function doTest()
{
    test()
}
