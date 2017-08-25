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
    var requirednumber = RandomRange(8, 10);
    var validateitem1 = form.getItemById(1509786018).asListItem();
    validateitem1.setRequired(false);
    SetValidationItem(validateitem1);
    validateitem1.setRequired(IsValidationRequiredItem(8, requirednumber, validateitem1));

    var validateitem2 = form.getItemById(1695237563).asMultipleChoiceItem();
    validateitem2.setRequired(false);
    SetValidationItem(validateitem2);
    validateitem2.setRequired(IsValidationRequiredItem(9, requirednumber, validateitem2));
    var choices = validateitem2.getChoices();
    choices.push(validateitem2.createChoice("Accidental Click (-_-\")"));
    validateitem2.setChoices(choices);

    var validateitem3 = form.getItemById(1461338387).asCheckboxItem();
    validateitem3.setRequired(false);
    SetValidationItem(validateitem3);
    validateitem3.setRequired(IsValidationRequiredItem(10, requirednumber, validateitem3));
}

function SetValidationItem(validateitem)
{
    var correctchoice = RandomRange(0, 3);
    var choices = new Array(4);
    for (var i = 0; i < choices.length; i++)
    {
        if (i == correctchoice) 
        {
            var a = RandomRange(0, 9);
            var b = RandomRange(0, 9);
            var c = a + b;
            var choicestring = a + " + " + b + " = " + c;
            choices[i] = validateitem.createChoice(choicestring);
        }
        else
        {
            var a, b, c;
            do
            {
                a = RandomRange(0, 9);
                b = RandomRange(0, 9);
                c = RandomRange(1, 18);
            }
            while (a + b == c)

            var choicestring = a + " + " + b + " = " + c;
            choices[i] = validateitem.createChoice(choicestring);
        }
    }
    validateitem.setChoices(choices);
}

function IsValidationRequiredItem(questionNumber, requiredNumber, validateitem)
{
    Logger.log(requiredNumber);
    if (questionNumber == requiredNumber) 
    {
        form.moveItem(validateitem.getIndex(), 8);
        return true;
    }
    else
    {
        return false;
    }
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
