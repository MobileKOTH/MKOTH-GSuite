//Global Constants
var ValidationSheetApp = SpreadsheetApp.openById("1zQMN_t94oS55TwO5kI7p-QRkJti0dRwvGwEuGqkxMY4");
var DataSheetApp = SpreadsheetApp.openById("1VRfWwvRSMQizzBanGNRMFVzoYFthrsNKzOgF5wKVM5I");
var ValidationSheet = ValidationSheetApp.getSheetByName("Series Form Submissions");
var FullLogSheet = ValidationSheetApp.getSheetByName("Full Logs");
var HistorySheet = DataSheetApp.getSheetByName("Series History");
var RankingSheet = DataSheetApp.getSheetByName("Rankings");
var PlayerStatsSheet = DataSheetApp.getSheetByName("Player Statistics");
var ManagementLogSheet = DataSheetApp.getSheetByName("Management Logs");

function Main()
{
    Logger.log("Hello MKOTH");
    var payload =
        {
            "content": "For MKOTH related commands: `.mkothhelp` (Beta)",
            "embeds":
            [
                {
                    "thumbnail": { "url": "https://cdn.discordapp.com/attachments/271109067261476866/330727796647395330/Untitled12111.jpg" },
                    "author": { "name": "RULES OF SERIES SUBMISSION", "icon_url": "https://cdn.discordapp.com/attachments/341163606605299716/352709311442452490/checklist.png" },
                    "title": "Only winners will submit the series",
                    "description":
                    "1. Select the exact ranking names of you and your opponent.\n\n" +
                    "2. The earlier you submit your series the better. E.g Player A completes his series with player B on 10/13/16, and submits their series on the same day. Player C and player D completes their series on 9/10/16 but submits their submits series on 11/13/16, it will be recorded that player A and B played their series first.\n\n" +
                    "3. If you accidentally submit a series with wrong information, approach a manager IMMEDIATELY as severe errors cannot be undone.\n\n" +
                    "4. SUBMITTING A FALSE SERIES WILL RESULT IN A PERMANENT BAN FROM MKOTH.\n",
                    "timestamp": new Date(),
                    "footer":
                    {
                        "text": "Updated",
                    },
                    "fields":
                    [
                        { "name": "Rank and Player Stats", "value": "Weblink: [MKOTH Series Data](https://docs.google.com/spreadsheets/d/1VRfWwvRSMQizzBanGNRMFVzoYFthrsNKzOgF5wKVM5I)", "inline": false },
                        { "name": "Series Submission Form", "value": "Weblink: [MKOTH Series Submission Form](https://docs.google.com/forms/d/e/1FAIpQLSdGJnCOl0l5HjxuYexVV_sOKPR1iScq3eiSxGiqKULX3zG4-Q/viewform)", "inline": false },
                        { "name": "Raw Series Submissions", "value": "Weblink: [MKOTH Series Pending and Validations](https://docs.google.com/spreadsheets/d/1zQMN_t94oS55TwO5kI7p-QRkJti0dRwvGwEuGqkxMY4)", "inline": false },
                        { "name": "Attributions", "value": "Icons made by [Vectors Market](https://www.flaticon.com/authors/vectors-market) and [Freepik](http://www.freepik.com) from [Flaticon](https://www.flaticon.com) is licensed by [CC 3.0 BY](http://creativecommons.org/licenses/by/3.0/)", "inline": false }
                    ],
                    "color": 9803157
                }
            ]
        }
    SendWebHook(payload);
}

function onOpen()
{
    //Create Management Control Panel
    var actions = SpreadsheetApp.newDataValidation().requireValueInList([
        Action.SELECT,
        Action.ADDPLAYER,
        Action.REMOVEPLAYER,
        Action.SUBMITSERIES,
        Action.SWAPSERIESPLAYERS,
        Action.PROMOTEKNIGHT]);
    var run = SpreadsheetApp.newDataValidation().requireValueInList([
        Comfirmation.NO,
        Comfirmation.YES]);
    actions.setAllowInvalid(false);
    run.setAllowInvalid(false);
    ManagementLogSheet.getRange("B1").setDataValidation(actions);
    ManagementLogSheet.getRange("B1").setValue(actions[0]);
    ManagementLogSheet.getRange("B5").setDataValidation(run);
    ManagementLogSheet.getRange("B5").setValue(Comfirmation.NO);
}

function onEdit(e)
{
    //debug logging for non management edits
    if (e.source.getSheetName() != ManagementLogSheet.getName())
    {
        FullLogSheet.appendRow([new Date(), "onEdit", e.source.getSheetName() + JSON.stringify(e.range.getA1Notation()) + JSON.stringify(e.user) + JSON.stringify(e)]);
    }

    //Management Actions UI
    if (e.source.getSheetName() == ManagementLogSheet.getSheetName())
    {
        if (e.range.getA1Notation() == "B1")
        {
            ManagementLogSheet.getRange("B2").setDataValidation(null);
            ManagementLogSheet.getRange("A2:A3").clearContent();
            var action = ManagementLogSheet.getRange("B1").getValue();

            //Parsing action names and create action hint
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

                default:
                    ManagementLogSheet.getRange("A2").setValue("No Action Selected");
                    break;
            }
        }

        //Run Management Action
        if (e.range.getA1Notation() == "B5")
        {
            if (ManagementLogSheet.getRange("B5").getValue() == Comfirmation.YES)
            {
                onClickRun();
            }
            ManagementLogSheet.getRange("B5").clearContent();
        }
    }
}

function GetPlayerValidationList()
{
    var playerlist = [];
    var playernames = [];
    playerlist = GetPlayerList();
    for (i = 0; i < playerlist.length; i++)
    {
        playernames.push(playerlist[i].name);
    }
    var players = SpreadsheetApp.newDataValidation().requireValueInList(playernames);
    ManagementLogSheet.getRange("B2").setDataValidation(players);
}