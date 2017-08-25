//Global Constants
var ValidationSheetApp = SpreadsheetApp.openById("1zQMN_t94oS55TwO5kI7p-QRkJti0dRwvGwEuGqkxMY4");
var FullLogSheet = ValidationSheetApp.getSheetByName("Full Logs");
var DataSheetApp = SpreadsheetApp.openById("1VRfWwvRSMQizzBanGNRMFVzoYFthrsNKzOgF5wKVM5I");
var PlayerStatsSheet = DataSheetApp.getSheetByName("Player Statistics");
var RankingSheet = DataSheetApp.getSheetByName("Rankings");

var form = FormApp.getActiveForm();

function Main()
{

}

function onOpen(e)
{
    GetPlayerValidationList();
    SetValidation();
    FullLogSheet.appendRow([new Date(), "FormEditOpen", JSON.stringify(e)]);
    FullLogSheet.sort(1, false);
}

function onFormSubmit(e)
{
    GetPlayerValidationList();
    SetValidation();
    FullLogSheet.appendRow([new Date(), "FormSubmitOpen", JSON.stringify(e)]);
    FullLogSheet.sort(1, false);
}

function SetValidation()
{
    var validateitem = form.getItems()[8].asListItem();
    validateitem.setTitle("Validation List Choice");
    validateitem.setRequired(true);

    var correctchoice = RandomRange(0, 3);
    var choices = new Array(4);
    for (var i = 0; i < choices.length; i++)
    {
        if (i == correctchoice) 
        {
            var a = RandomRange(1, 9);
            var b = RandomRange(1, 9);
            var c = a + b;
            var choicestring = a + " + " + b + " = " + c;
            choices[i] = validateitem.createChoice(choicestring);
        }
        else
        {
            var a = RandomRange(1, 9);
            var b = RandomRange(1, 9);
            var c = a + b + RandomRange(-9, 9);
            while (a + b == c) 
            {
                a = RandomRange(1, 9);
                b = RandomRange(1, 9);
                c = a + b + RandomRange(-9, 9);
            }
            var choicestring = a + " + " + b + " = " + c;
            choices[i] = validateitem.createChoice(choicestring);
        }
    }
    validateitem.setChoices(choices);


    validateitem = form.getItems()[9].asMultipleChoiceItem();
    validateitem.setTitle("Validation MCQ" + " (NOT REQUIRED)");
    validateitem.setRequired(false);

    var correctchoice = RandomRange(0, 3);
    var choices = new Array(4);
    for (var i = 0; i < choices.length; i++)
    {
        if (i == correctchoice) 
        {
            var a = RandomRange(1, 9);
            var b = RandomRange(1, 9);
            var c = a + b;
            var choicestring = a + " + " + b + " = " + c;
            choices[i] = validateitem.createChoice(choicestring);
        }
        else
        {
            var a = RandomRange(1, 9);
            var b = RandomRange(1, 9);
            var c = a + b + RandomRange(-9, 9);
            while (a + b == c) 
            {
                a = RandomRange(1, 9);
                b = RandomRange(1, 9);
                c = a + b + RandomRange(-9, 9);
            }
            var choicestring = a + " + " + b + " = " + c;
            choices[i] = validateitem.createChoice(choicestring);
        }
    }
    choices.push(validateitem.createChoice("Accidental Clicked (-_-\")"));
    validateitem.setChoices(choices);
}

function GetPlayerValidationList()
{
    var playerlist = [];
    var playernames = [];
    playerlist = GetPlayerList();
    for (i = 0; i < playerlist.length; i++)
    {
        if (playerlist[i].isRemoved)
        {
            continue;
        }
        playernames.push(playerlist[i].name);
    }
    var item = form.getItems()[1].asListItem();
    var item2 = form.getItems()[2].asListItem();
    var choices = [];
    for (i = 0; i < playernames.length; i++)
    {
        choices.push(item.createChoice(playernames[i]));
    }
    item.setChoices(choices);
    item2.setChoices(choices);
    Logger.log(playernames);
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
