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

function Main()
{

}

function onOpen()
{
    //Create Management Control Panel
    var actionlist = []
    for (var key in Action)
    {
        var element = Action[key];
        actionlist.push(element);
    }
    var actions = SpreadsheetApp.newDataValidation().requireValueInList(actionlist);
    var run = SpreadsheetApp.newDataValidation().requireValueInList([Comfirmation.NO, Comfirmation.YES]);
    actions.setAllowInvalid(false);
    run.setAllowInvalid(false);
    ManagementLogSheet.getRange("B1").setDataValidation(actions);
    ManagementLogSheet.getRange("B1").setValue(Action.SELECT);
    ManagementLogSheet.getRange("B5").setDataValidation(run);
    ManagementLogSheet.getRange("B5").setValue(Comfirmation.NO);
}

function onAdvancedEdit(e)
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