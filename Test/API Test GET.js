function doGet(request)
{

    var data = UrlFetchApp.fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vSITdXPzQ_5eidATjL9j7uBicp4qvDuhx55IPvbMJ_jor8JU60UWCHwaHdXcR654W8Tp6VIjg-8V7g0/pub?output=tsv").getContentText();
    Logger.log(data);
    if (request.parameter.resource == "mkoth")
    {
        if (request.parameter.item == "item")
        {
            var result =
                {
                    request: request,
                    response: parseTSV(data)
                };
            return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
        }
    }
}

// Comma-separated values to JSON
function parseCSV(data)
{
    return parseDSV(data, ",");
}

// Tabulation-separated values to JSON
function parseTSV(data)
{
    return parseDSV(data, "\t");
}

// Delimiter-separated values to JSON
function parseDSV(data, separator)
{
    var lines = data.split("\r\n");
    var headers = lines[0].split(separator);
    var result = [];
    for (var i = 1, len = lines.length; i < lines.length; i++)
    {
        var obj = {};
        var line = lines[i].split(separator);

        for (var j = 0, len = headers.length; j < headers.length; j++)
        {
            obj[headers[j].replace(" ", "_")] = line[j];
        }

        result.push(obj);
    }
    return result;
}
