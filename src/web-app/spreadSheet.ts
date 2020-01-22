import { RequestGetBase, Helpers, RequestPostBase } from '../../lib/app-script-router'
import { handleGet, IQueryOperation, handlePost } from '../../lib/spreadsheet-database/jsonWebAPI'
import { RootQuery } from './root'
import { AdminRequest } from './admin'

RootQuery.spreadSheet =
{
    get(request: RequestGetBase<any>)
    {
        return ContentService.createTextOutput(handleGet(parseQuery(request.parameter), SpreadsheetApp.getActive(), request.parameter.spreadSheet))
            .setMimeType(ContentService.MimeType.JSON)
    },
    post(request: AdminRequest<RequestPostBase<any>>)
    {
        if (!request.isAdmin)
        {
            return Helpers.returnUnauthorised()
        }
        return ContentService.createTextOutput(handlePost(parseQuery(request.parameter), request.postData.contents, SpreadsheetApp.getActive(), request.parameter.spreadSheet))
            .setMimeType(ContentService.MimeType.JSON)
    }
}

function parseQuery(param: { [key: string]: string }): IQueryOperation
{
    switch (param.operation)
    {
        case "all": {
            return { type: "all" }
        }

        default: {
            return { type: "unknown" as any }
        }
    }
}
