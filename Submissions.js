//Global Constants
var ValidationSheetApp = SpreadsheetApp.openById("1zQMN_t94oS55TwO5kI7p-QRkJti0dRwvGwEuGqkxMY4");
var DataSheetApp = SpreadsheetApp.openById("1VRfWwvRSMQizzBanGNRMFVzoYFthrsNKzOgF5wKVM5I");
var ValidationSheet = ValidationSheetApp.getSheetByName("Series Form Submissions");
var HistorySheet = DataSheetApp.getSheetByName("Series History");
var WebHook = ValidationSheetApp.getSheetByName("Webhook Triggers");

var lastRow = ValidationSheet.getRange(ValidationSheet.getLastRow(), 1, 1, 12);

function onFormSubmit(e)
{
    var validation = [];
    validation.push(lastRow.getValues()[0][9]);
    validation.push(lastRow.getValues()[0][10]);
    validation.push(lastRow.getValues()[0][11]);

    var haswronganswer = false;
    for (var i = 0; i < validation.length; i++)
    {
        var answer = String(validation[i]);
        if (answer.length > 0 && answer != "NOT APPLICABLE") 
        {
            var answerparts = answer.split(" ");
            var a = Number(answerparts[0]);
            var b = Number(answerparts[2]);
            var c = Number(answerparts[4]);
            if (a + b != c) 
            {
                haswronganswer = true;
                lastRow.getCell(1, 10 + i).setBackground("red");
            }
            else
            {
                lastRow.getCell(1, 10 + i).setBackground("#6AA84F");
            }
        }
    }
    if (haswronganswer) 
    {
        lastRow.getCell(1, 9).setValue("Submission failed maths");
        lastRow.getCell(1, 9).setBackground("red");
    }

    var content = "<@!234242692303814657> has successfully defended <@!234242692303814657> in a ranked series with a score of 1:2";
    var seriestype = "Series Type: Ranked";
    var seriesicon = "https://cdn.iconscout.com/public/images/icon/free/png-512/trophy-medal-winner-prize-37ca31b0a43c9f59-512x512.png";
    var sheeturl = "https://docs.google.com/spreadsheets/d/1zQMN_t94oS55TwO5kI7p-QRkJti0dRwvGwEuGqkxMY4";
    var title = "A defender has won!";
    var description = "`validation: 1 + 1 = 11 -> failed maths`\nUnfortunately the submiter failed to answer the correct maths quiz and the series will be rejected! ";
    var color = 16777215;
    var payload =
        {
            "content": content,
            "embeds":
            [
                {
                    "author":
                    {
                        "name": seriestype,
                        "icon_url": seriesicon
                    },
                    "url": sheeturl,
                    "title": title,
                    "description": description,
                    "timestamp": lastRow.getCell(1, 1).getValue(),
                    "footer":
                    {
                        "text": "Submission Time",
                        "icon_url": "https://image.flaticon.com/icons/png/512/272/272479.png"
                    },
                    "fields":
                    [
                        { "name": lastRow.getCell(1, 3).getValue(), "value": lastRow.getCell(1, 5).getValue(), "inline": true },
                        { "name": lastRow.getCell(1, 4).getValue(), "value": lastRow.getCell(1, 6).getValue(), "inline": true }
                    ],
                    "color": color
                }
            ]
        }
    var options =
        {
            'method': 'post',
            'contentType': 'application/json',
            'payload': JSON.stringify(payload),
        }

    var response = UrlFetchApp.fetch("https://discordapp.com/api/webhooks/347448465581670401/iRwT4q4ZtaqRuXQ-QIoSXdAnVmGM5j9fMSMYw4eYJraSD6HeGTKBam70lGaB2Z2pmSHp", options);
    Logger.log(response.getHeaders());

}