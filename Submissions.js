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

    var answercount = 0;
    var haswronganswer = false;
    for (var i = 0; i < validation.length; i++)
    {
        var answer = String(validation[i]);
        if (answer.length > 0 && answer != "Accidental Click (-_-\")") 
        {
            var answerparts = answer.split(" ");
            var a = Number(answerparts[0]);
            var b = Number(answerparts[2]);
            var c = Number(answerparts[4]);
            if (a + b != c) 
            {
                haswronganswer = true;
            }
            answercount++;
        }
    }
    if (haswronganswer) 
    {
        lastRow.getCell(1, 9).setValue("Submission failed maths");
        lastRow.getCell(1, 9).setBackground("red");
    }
    else
    {
        lastRow.getCell(1, 9).setBackground("#00ff00");
    }
    if (answercount > 1 && !haswronganswer) 
    {
        lastRow.getCell(1, 9).setValue("Submission has extra answers");
        lastRow.getCell(1, 9).setBackground("yellow");
    }
}