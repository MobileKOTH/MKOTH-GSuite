//Global Constants
var ValidationSheetApp = SpreadsheetApp.openById("1zQMN_t94oS55TwO5kI7p-QRkJti0dRwvGwEuGqkxMY4");
var DataSheetApp = SpreadsheetApp.openById("1VRfWwvRSMQizzBanGNRMFVzoYFthrsNKzOgF5wKVM5I");
var ValidationSheet = ValidationSheetApp.getSheetByName("Series Form Submissions");
var PlayerCodeSheet = ValidationSheetApp.getSheetByName("Player Code");
var FullLogSheet = ValidationSheetApp.getSheetByName("Full Logs");
var HistorySheet = DataSheetApp.getSheetByName("Series History");
var RankingSheet = DataSheetApp.getSheetByName("Rankings");
var PlayerStatsSheet = DataSheetApp.getSheetByName("Player Statistics");
var ManagementLogSheet = DataSheetApp.getSheetByName("Management Logs");
var Form = FormApp.openById("1Ccym-20keX_AbFlELm1s0nYNsST71GJMzUcIusz7bIU");

var lastRow = ValidationSheet.getRange(ValidationSheet.getLastRow(), 1, 1, 13);
var previousInviteCodesRange = ValidationSheet.getRange(1, 13, (ValidationSheet.getLastRow() <= 1) ? 1 : ValidationSheet.getLastRow() - 1, 1).getValues();
var previousInviteCodes = [];
var validgamecode = true;

for (var key in previousInviteCodesRange)
{
    if (previousInviteCodesRange.hasOwnProperty(key))
    {
        var element = previousInviteCodesRange[key];
        previousInviteCodes.push(element[0]);
    }
}

function Main()
{

}

function onOpen()
{
    //Create Manament Context Menu
    ValidationSheetApp.addMenu("Management",
        [
            { name: "Update Player Code", functionName: "GeneratePlayerCode" },
            { name: "Resubmit Series", functionName: "ResubmitSeries" }
        ]);
}

function ResubmitSeries()
{
    var input = Browser.inputBox("Series Resubmission", "Select Row to resubmit", Browser.Buttons.OK_CANCEL);
    if (input == "cancel")
    {
        return;
    }
    var row = Number(input);
    if (!isNaN(row) && input != "")
    {
        if (row <= ValidationSheet.getLastRow())
        {
            lastRow = ValidationSheet.getRange(row, 1, 1, 13);
            onFormSubmit();
            return;
        }
        Browser.msgBox("Invalid input!");
        return;
    }
    Browser.msgBox("Invalid input!");
}

function onFormSubmit(e)
{
    var runTime = new Date().getTime();
    var lastrowvalues = lastRow.getValues()[0];
    var validationcode = lastrowvalues[7];
    var validation = [];
    validation.push(lastrowvalues[9]);
    validation.push(lastrowvalues[10]);
    validation.push(lastrowvalues[11]);
    var answer = "";
    var gamecode = lastrowvalues[12];

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
                validationstatus = " -> failed, the series will probed.`\n";
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
    if (!IsValidPlayerCode(validationcode, series)) 
    {
        var content = "`Webhook delay: " + (runTime - series.date.getTime()) + " ms`\n" +
            "A submission has been automatically rejected due to invalid identification code for the winner.\n" +
            "```json\n" + JSON.stringify(series) + "\n```";
        var payload =
            {
                "content": content,
            }
        var options =
            {
                'method': 'post',
                'contentType': 'application/json',
                'payload': JSON.stringify(payload),
            }

        var response = UrlFetchApp.fetch(Webhookurl, options);
        Logger.log(response.getHeaders());
        FullLogSheet.appendRow([new Date(), "Submission Rejection", JSON.stringify(lastRow.getValues())]);
        FullLogSheet.sort(1, false);
        ValidationSheet.deleteRow(ValidationSheet.getLastRow());
        return;
    }

    var seriestype = "Series Type: " + series.type;
    var seriesicon = GenerateSeriesIcon(series);
    var sheeturl = "https://docs.google.com/spreadsheets/d/1zQMN_t94oS55TwO5kI7p-QRkJti0dRwvGwEuGqkxMY4";
    var title = GenerateSeriesTitle(series);
    var description = "`validation: " + answer + validationstatus;
    if (!series.isValid()) 
    {
        description += "However, " + invalidReason.toLowerCase() + ", the series will be audited. Note that the series is not rejected, this message is just a warning as it does not take account for any pending series above, refer to submission rule #4\n"
        lastRow.getCell(1, 9).setValue(invalidReason);
        lastRow.getCell(1, 9).setBackground("red");
    }
    description += GetBattleTVLinkString(gamecode);
    var color = GenerateSeriesColor(series, haswronganswer);
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
    if (!series.isValid() || haswronganswer || !validgamecode) 
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
                return 43775;
            }
            else
            {
                return 16766208;
            }
            break;
    }
}

/**
* 
* @param {String} gamecode
* @returns {String}
*/
function GetBattleTVLinkString(gamecode)
{
    var battleTVlink = "https://battles.tv/watch/" + gamecode;
    for (var key in previousInviteCodes)
    {
        if (previousInviteCodes.hasOwnProperty(key))
        {
            var element = previousInviteCodes[key];
            if (element == gamecode) 
            {
                validgamecode = false;
                lastRow.getCell(1, 13).setBackground("red");
                lastRow.getCell(1, 9).setBackground("red");
                lastRow.getCell(1, 9).setValue("Repeated game code");
                return "This game code is already used by another series!"
            }
        }
    }
    try
    {
        var options = { muteHttpExceptions: true };
        var response = UrlFetchApp.fetch(battleTVlink, options);
        if (response.getResponseCode() != 200)
        {
            validgamecode = false;
            lastRow.getCell(1, 13).setBackground("red");
            lastRow.getCell(1, 9).setBackground("red");
            lastRow.getCell(1, 9).setValue("Invalid game code");
            return "Invalid game code used!"
        }
    }
    catch (error)
    {
        battleTVlink = error.message;
    }
    return "Battles TV: " + battleTVlink;
}

/**
 * 
 * @param {Number} code 
 * @param {Series} series
 * @returns {Boolean}
 */
function IsValidPlayerCode(code, series)
{
    var playerCodeList = PlayerCodeSheet.getRange(1, 1, PlayerCodeSheet.getLastRow(), 2).getValues();
    for (var pc = 0; pc < playerCodeList.length; pc++)
    {
        var element = playerCodeList[pc];
        if (element[0] == series.GetWinner().name) 
        {
            playercode = element[1];
            if (playercode == code) 
            {
                return true;
            }
        }
    }
    return false;
}

/**
* Returns a range int range from the parameters inclusive.
* @param {number} min 
* @param {number} max
* @returns {number}
*/
function RandomRange(min, max)
{
    var difference = max - min + 1;
    var randomrange = Math.random() * difference;
    randomrange = Math.floor(randomrange);
    return min + randomrange;
}