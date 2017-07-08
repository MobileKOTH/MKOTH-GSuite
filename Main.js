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
}

function onOpen()
{
    //Create Management Control Panel
    var actions = SpreadsheetApp.newDataValidation().requireValueInList([
        "Select Action", 
        "Add Player", 
        "Remove Player", 
        "Submit Series", 
        "Rebuild Ranking", 
        "Promote Knight"]
        );
    var run = SpreadsheetApp.newDataValidation().requireValueInList([
        "Not Run", 
        "Run"
        ]);
    actions.setAllowInvalid(false);
    run.setAllowInvalid(false);
    ManagementLogSheet.getRange("B1").setDataValidation(actions);
    ManagementLogSheet.getRange("B1").setValue(actions[0]);
    ManagementLogSheet.getRange("B5").setDataValidation(run);
    ManagementLogSheet.getRange("B5").setValue("Not Run");
}

function onEdit(e)
{
    //debug logging for non management edits
    var eString = e.source.getSheetName() + " " + e.range.getA1Notation() + " " + e.user.getEmail() + Logger.log(e).getLog();
    if (e.source.getSheetName() != "Management Logs")
    {
        FullLogSheet.appendRow([new Date(), "onEdit", String(eString)]);
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
            if (action == ("Add Player"))
            {
                ManagementLogSheet.getRange("A2").setValue("Enter player Name: ");
            }
            if (action == ("Remove Player"))
            {
                GetPlayerValidationList();
            }
            if (action == ("Submit Series"))
            {
                ManagementLogSheet.getRange("A2").setValue("Submit all series ");
                ManagementLogSheet.getRange("A3").setValue("from validation sheet.");
                ManagementLogSheet.getRange("B2:B3").clearContent();
            }
            if (action == ("Promote Knight"))
            {
                GetPlayerValidationList();
            }
            if (action == ("Rebuild Ranking"))
            {
                ManagementLogSheet.getRange("A2").setValue("Recalculate ranking");
                ManagementLogSheet.getRange("A3").setValue("takes very long time");
            }
        }

        //Run Management Action
        if (e.range.getA1Notation() == "B5")
        {
            if (ManagementLogSheet.getRange("B5").getValue() == ("Run"))
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
    ManagementLogSheet.getRange("A2").setValue("Choose player Name: ");
    var players = SpreadsheetApp.newDataValidation().requireValueInList(playernames);
    ManagementLogSheet.getRange("B2").setDataValidation(players);
}