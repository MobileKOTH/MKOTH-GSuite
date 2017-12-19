// Global Constants
var DataSheetApp = SpreadsheetApp.getActive();
var HistorySheet = DataSheetApp.getSheetByName("Series History");
var RankingSheet = DataSheetApp.getSheetByName("Rankings");
var PlayerStatsSheet = DataSheetApp.getSheetByName("Player Statistics");
var ManagementLogSheet = DataSheetApp.getSheetByName("Management Logs");
var PlayerIndepthStatsSheet = DataSheetApp.getSheetByName("Player Indepth Statistics");
// Just stand by the external validation sheet variable holder so it does'nt always load to cause permission errors 
/** @type {GoogleAppsScript.Spreadsheet.SpreadsheetApp} */
var ValidationSheetApp;
/** @type {GoogleAppsScript.Spreadsheet.Spreadsheet} */
var ValidationSheet, PlayerCodeSheet, FullLogSheet;
// Load the validation sheets only if needed
function LoadValidationSheets()
{
    ValidationSheetApp = SpreadsheetApp.openById("1zQMN_t94oS55TwO5kI7p-QRkJti0dRwvGwEuGqkxMY4");
    ValidationSheet = ValidationSheetApp.getSheetByName("Series Form Submissions");
    PlayerCodeSheet = ValidationSheetApp.getSheetByName("Player Code");
    FullLogSheet = ValidationSheetApp.getSheetByName("Full Logs");
}
// Main method just for testing
function Main()
{

}
// Daily event run for holiday mode and demotion
function onDayTrigger(e)
{
    HolidayModeMIP.ScaleMIP();
    for (var key in PlayerList)
    {
        if (PlayerList.hasOwnProperty(key))
        {
            var element = PlayerList[key];
            element.mip++;

            if (Tools.MIPWarningPeriod(element.mip) && !element.isHoliday && !element.isRemoved)
            {
                var reminder;
                if (element.class == PlayerClass.NOBLEMAN || element.class == PlayerClass.KING)
                {
                    reminder = element.GetDiscordMention() + ", You have around" + (HolidayModeMIP.HM - element.mip) + " more or less day(s) to PLAY a King Series or WIN a Ranked/Knight to stay at your current class for the next month, not winning Ranked/Knight series will only delay your demotion by 2 days.";
                }
                else
                {
                    reminder = element.GetDiscordMention() + ", You have around" + (HolidayModeMIP.HM - element.mip) + " more or less day(s) play any series or you will be placed into holiday mode. Joining back from holiday mode will cause to you to be placed at the last rank of your class."
                }
                var payload =
                    {
                        "username": "MKOTH Rankings",
                        "avatar_url": "https://cdn.discordapp.com/attachments/341163606605299716/352269545030942720/mkoth_thumb.jpg",
                        "content": reminder
                    };
                SendWebHook(payload);

            }
            if (element.mip >= HolidayModeMIP.HM && !element.isHoliday && !element.isRemoved)
            {
                var message;
                if (element.class == PlayerClass.NOBLEMAN || element.class == PlayerClass.KING)
                {
                    element.Demote();
                    message = element.GetDiscordMention() + ", You have been demoted."
                }
                else
                {
                    element.EnterHoliday();
                    message = element.GetDiscordMention() + ", You have been placed into holiday mode."
                }
                var payload =
                    {
                        "username": "MKOTH Rankings",
                        "avatar_url": "https://cdn.discordapp.com/attachments/341163606605299716/352269545030942720/mkoth_thumb.jpg",
                        "content": message
                    };
                SendWebHook(payload);
            }
        }
    }
    LoadValidationSheets();
    UpdatePlayerList();
    UpdateRankList();
    FlushFormulas();
    FullLogSheet.appendRow([new Date(), "HolidayModeRun", "Time used: " + ((new Date()).getTime() - runtime) / 1000 + "secs"]);
}
// Entry event when the sheet opened by an editor
function onOpen()
{
    // Create Manament Context Menu
    DataSheetApp.addMenu("Management",
        [
            { name: "Flush Formulas", functionName: "FlushFormulas" }
        ]);

    // Create Management Control Panel
    var actions = SpreadsheetApp.newDataValidation().requireValueInList(Tools.Arrayify(Action));
    var run = SpreadsheetApp.newDataValidation().requireValueInList(Tools.Arrayify(Comfirmation));
    actions.setAllowInvalid(false);
    run.setAllowInvalid(false);
    ManagementLogSheet.getRange("B1").setDataValidation(actions);
    ManagementLogSheet.getRange("B1").setValue(Action.SELECT);
    ManagementLogSheet.getRange("B5").setDataValidation(run);
    ManagementLogSheet.getRange("B5").clearContent();
}
// Entry event when sheet is edited
function onAdvancedEdit(e)
{
    Tools.SortSheets();

    // Debug logging for non management edits
    if (e.source.getSheetName() != ManagementLogSheet.getName())
    {
        FullLogSheet.appendRow([new Date(), "onEdit", e.source.getSheetName() + JSON.stringify(e.range.getA1Notation()) + JSON.stringify(e.user) + JSON.stringify(e)]);
    }

    // Record discord id for player
    if (e.source.getSheetName() == PlayerStatsSheet.getName())
    {
        /** @type {GoogleAppsScript.Spreadsheet.Range} */
        var range = e.range;
        if (range.getColumn() == 10)
        {
            var payload =
                {
                    "username": "MKOTH Rankings",
                    "avatar_url": "https://cdn.discordapp.com/attachments/341163606605299716/352269545030942720/mkoth_thumb.jpg",
                    "content": "Welcome! <@!" + range.getValue() + ">, you are now officially added to the MKOTH Ranking, your name will appear on the series submission form very soon."
                };
            SendWebHook(payload);
        }
    }

    // Management Actions UI
    if (e.source.getSheetName() == ManagementLogSheet.getSheetName())
    {
        if (e.range.getA1Notation() == "B1")
        {
            ManagementLogSheet.getRange("B2").setDataValidation(null);
            ManagementLogSheet.getRange("A2:A3").clearContent();
            var action = ManagementLogSheet.getRange("B1").getValue();

            // Parsing action names and create action hint
            switch (action)
            {
                case Action.ADDPLAYER:
                    ManagementLogSheet.getRange("A2").setValue("Enter player Name: ");
                    break;

                case Action.REMOVEPLAYER:
                    ManagementLogSheet.getRange("A2").setValue("Choose player Name: ");
                    GetPlayerValidationList();
                    break;

                case Action.SUBMITSERIES:
                    ManagementLogSheet.getRange("A2").setValue("Submit all series ");
                    ManagementLogSheet.getRange("A3").setValue("from validation sheet.");
                    ManagementLogSheet.getRange("B2:B3").clearContent();
                    break;

                case Action.SWAPSERIESPLAYERS:
                    ManagementLogSheet.getRange("A2").setValue("Fix wrong player orders");
                    ManagementLogSheet.getRange("A3").setValue("from validation sheet.");
                    ManagementLogSheet.getRange("B2:B3").clearContent();
                    break;

                case Action.PROMOTEKNIGHT:
                    ManagementLogSheet.getRange("A2").setValue("Choose player Name: ");
                    GetPlayerValidationList();
                    break;

                case Action.READDPLAYER:
                    ManagementLogSheet.getRange("A2").setValue("Choose player Name: ");
                    ManagementLogSheet.getRange("A3").setValue("Old point value: ");
                    GetPlayerRemoved();
                    break;

                default:
                    ManagementLogSheet.getRange("A2").setValue("No Action Selected");
                    break;
            }
        }

        // Run Management Action
        if (e.range.getA1Notation() == "B5")
        {
            if (ManagementLogSheet.getRange("B5").getValue() == Comfirmation.YES)
            {
                onClickRun();
            }
            ManagementLogSheet.getRange("B5").clearContent();
        }
    }

    Tools.SortSheets();
}
// Get a non-removed player list for control panel
function GetPlayerValidationList()
{
    var playernames = [];
    for (i = 0; i < PlayerList.length; i++)
    {
        if (!PlayerList[i].isRemoved)
        {
            playernames.push(PlayerList[i].name);
        }
    }
    var players = SpreadsheetApp.newDataValidation().requireValueInList(playernames);
    ManagementLogSheet.getRange("B2").setDataValidation(players);
}
// Get a removed player list for control panel
function GetPlayerRemoved()
{
    var playernames = [];
    for (i = 0; i < PlayerList.length; i++)
    {
        if (PlayerList[i].isRemoved)
        {
            playernames.push(PlayerList[i].name);
        }
    }
    var players = SpreadsheetApp.newDataValidation().requireValueInList(playernames);
    ManagementLogSheet.getRange("B2").setDataValidation(players);
}