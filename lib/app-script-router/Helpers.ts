// App Script is unable to raise a HTTP error code, any errors will return a error page (default or a preset below) with code 200.
export class Helpers
{
    static returnEmpty(request: any)
    {
        return ContentService.createTextOutput(`error: executed with no returns \n${JSON.stringify(request, undefined, 2)}`).setMimeType(ContentService.MimeType.TEXT)
    }

    static returnError(error: Error, request: any)
    {
        return ContentService.createTextOutput(`error: ${error.name}\n${error.message}\n${error.stack}\n${JSON.stringify(request, undefined, 2)}`).setMimeType(ContentService.MimeType.TEXT)
    }

    static returnJSON(data: any)
    {
        return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON)
    }

    static returnUnauthorised()
    {
        return ContentService.createTextOutput("Unauthorised").setMimeType(ContentService.MimeType.TEXT)
    }
}
