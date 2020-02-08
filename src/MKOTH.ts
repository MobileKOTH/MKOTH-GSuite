import './web-app'

import { Handler, RequestGetBase, RequestPostBase } from "../lib/app-script-router"
import { administer, RoutingRoot } from './web-app'
import { test } from './test'
import { clearCache as clearEntityCache } from '../lib/spreadsheet-database/jsonWebAPI'

export function doGet(request: GoogleAppsScript.Events.DoGet & RequestGetBase<any>)
{
    return new Handler(RoutingRoot).handleGet(administer(request))
}

export function doPost(request: GoogleAppsScript.Events.DoPost & RequestPostBase<any>)
{
    return new Handler(RoutingRoot).handlePost(administer(request))
}

export function onEdit(e: GoogleAppsScript.Events.SheetsOnEdit)
{
    const sheetName = e.source.getSheetName()
    console.log("Sheet Edit", sheetName)
    clearEntityCache(sheetName)
}

export function doTest()
{
    var testSet = Array.from(Array(5).keys())
    Logger.log(testSet.find(x => x == 1))
    Logger.log(testSet.includes(1))
    Logger.log("test".includes("t"))
    Logger.log(Object.values({test: "lol"}))
    test();
}
