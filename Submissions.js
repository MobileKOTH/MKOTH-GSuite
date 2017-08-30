//Global Constants
var ValidationSheetApp = SpreadsheetApp.openById("1zQMN_t94oS55TwO5kI7p-QRkJti0dRwvGwEuGqkxMY4");
var DataSheetApp = SpreadsheetApp.openById("1VRfWwvRSMQizzBanGNRMFVzoYFthrsNKzOgF5wKVM5I");
var ValidationSheet = ValidationSheetApp.getSheetByName("Series Form Submissions");
var FullLogSheet = ValidationSheetApp.getSheetByName("Full Logs");
var HistorySheet = DataSheetApp.getSheetByName("Series History");
var RankingSheet = DataSheetApp.getSheetByName("Rankings");
var PlayerStatsSheet = DataSheetApp.getSheetByName("Player Statistics");
var ManagementLogSheet = DataSheetApp.getSheetByName("Management Logs");

var lastRow = ValidationSheet.getRange(ValidationSheet.getLastRow(), 1, 1, 12);

function onFormSubmit(e)
{
    var validation = [];
    var lastrowvalues = lastRow.getValues()[0];
    validation.push(lastrowvalues[9]);
    validation.push(lastrowvalues[10]);
    validation.push(lastrowvalues[11]);
    var answer = "";

    var haswronganswer = false;
    var validationstatus = " -> passed`\n";
    for (var i = 0; i < validation.length; i++)
    {
        answer = String(validation[i]);
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
                validationstatus = " -> failed, the series will be considered void.`\n";
            }
            else
            {
                lastRow.getCell(1, 10 + i).setBackground("#6AA84F");
            }
            break;
        }
    }
    if (haswronganswer) 
    {
        lastRow.getCell(1, 9).setValue("Submission failed maths");
        lastRow.getCell(1, 9).setBackground("red");
    }
    var series = new Series(lastrowvalues[0], lastrowvalues[1], lastrowvalues[2], lastrowvalues[3], lastrowvalues[4], lastrowvalues[5], lastrowvalues[6]);

    var seriestype = "Series Type: " + series.type;
    var seriesicon = GenerateSeriesIcon(series);
    var sheeturl = "https://docs.google.com/spreadsheets/d/1zQMN_t94oS55TwO5kI7p-QRkJti0dRwvGwEuGqkxMY4";
    var title = GenerateSeriesTitle(series);
    var description = "`validation: " + answer + validationstatus;
    if (!series.isValid()) 
    {
        description += "However, " + invalidReason.toLowerCase() + ", the series will be looked into and to be considered as void."
        lastRow.getCell(1, 9).setValue(invalidReason);
        lastRow.getCell(1, 9).setBackground("red");
    }
    var color = GenerateSeriesColor(series, haswronganswer);
    var runTime = new Date().getTime();
    var content = "`Webhook delay: " + (runTime - series.date.getTime()) + " ms`\n" + GenerateWinText(series);
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
                        "icon_url": "https://cdn.discordapp.com/attachments/341163606605299716/352026248773500939/schedule.png"
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

    var response = UrlFetchApp.fetch(Webhookurl, options);
    Logger.log(response.getHeaders());

}

/**
 * 
 * @param {Series} series
 * @returns {String}
 */
function GenerateWinText(series)
{
    var winnerping = "<@!" + series.GetWinner().discordid + "> (Rank: " + series.GetWinner().rank + " Points: " + series.GetWinner().points + ")";
    var loserping = "<@!" + series.GetLoser().discordid + "> (Rank: " + series.GetLoser().rank + " Points: " + series.GetLoser().points + ")";
    var scoretext = "";
    if (series.player1wins > series.player2wins) 
    {
        scoretext = series.player1wins + " : " + series.player2wins;
    }
    else
    {
        scoretext = series.player2wins + " : " + series.player1wins;
    }
    var pointchange = 0;
    if (series.GetWinner() == series.player1) 
    {
        pointchange = series.GetRewardPoints() - series.GetCostPoint();
    }
    else
    {
        pointchange = series.GetRewardPoints();
    }
    var gainlosspointtext = "";
    if (pointchange >= 0)
    {
        gainlosspointtext = " to gain " + pointchange;
    }
    else
    {
        gainlosspointtext = " to lose " + Math.abs(pointchange);
    }

    var content = winnerping + " has defeated " + loserping + gainlosspointtext + " points in a " + series.type + " series to with a score of " + scoretext;

    return content;
}

/**
 * 
 * @param {Series} series
 * @returns {String}
 */
function GenerateSeriesTitle(series)
{
    switch (series.type) 
    {
        case SeriesType.POINT:
            return "A point series has submited";
            break;

        case SeriesType.RANKED:
            if (series.player1wins > series.player2wins) 
            {
                return "A challenger has won to take the rank of " + series.player2.rank + "!";
            }
            else
            {
                return "A defender has won!";
            }
            break;

        case SeriesType.KNIGHT:
            if (series.player1wins > series.player2wins) 
            {
                return "A knight challenger has won to become a Nobleman!";
            }
            else
            {
                return "A knight has successfully defended our king!";
            }
            break;

        case SeriesType.KING:
            if (series.player1wins > series.player2wins) 
            {
                return "ALL BOW DOWN TO OUR NEW KING: " + series.GetWinner().name + "!";
            }
            else
            {
                return "A King has successfully defended his throne!";
            }
            break;
    }
}

/**
 * 
 * @param {Series} series
 * @returns {String}
 */
function GenerateSeriesIcon(series)
{
    switch (series.type) 
    {
        case SeriesType.POINT:
            return "https://cdn.discordapp.com/attachments/341163606605299716/351982100020461569/trophy.png";
            break;

        case SeriesType.RANKED:
            return "https://cdn.discordapp.com/attachments/341163606605299716/352026221481164801/ranking.png";
            break;

        case SeriesType.KNIGHT:
            return "https://cdn.discordapp.com/attachments/341163606605299716/352026205115121664/strategy.png";
            break;

        case SeriesType.KING:
            return "https://cdn.discordapp.com/attachments/341163606605299716/352026213306335234/crown.png";
            break;
    }
}

/**
 * 
 * @param {Series} series
 * @returns {Number}
 */
function GenerateSeriesColor(series, haswronganswer)
{
    if (!series.isValid() || haswronganswer) 
    {
        return 16711680;
    }
    switch (series.type) 
    {
        case SeriesType.POINT:
            return 8947848;
            break;

        default:
            if (series.player2wins > series.player1wins) 
            {
                return 13228792;
            }
            else
            {
                return 43775;
            }
            break;
    }
}