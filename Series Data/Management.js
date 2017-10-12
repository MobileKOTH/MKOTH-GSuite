//** Management Selections */
var Action =
  {
    SELECT: "Select Action",
    ADDPLAYER: "Add Player",
    REMOVEPLAYER: "Remove Player",
    SUBMITSERIES: "Submit Series",
    SWAPSERIESPLAYERS: "Swap Series Players",
    PROMOTEKNIGHT: "Promote Knight",
  }

var Comfirmation =
  {
    YES: "RUN",
    NO: "NOT RUN"
  }

var runtime = new Date().getTime();

//Running of Management Action
function onClickRun()
{
  Tools.SortSheets();

  RunProgress("Running Please Wait");
  var action = ManagementLogSheet.getRange("B1").getValue();
  var input1 = ManagementLogSheet.getRange("B2").getValue();
  var input2 = ManagementLogSheet.getRange("B3").getValue();
  var success = false;

  //Parsing actions
  switch (action)
  {
    case Action.SELECT:
      RunError("No Action Selected!");
      break;

    case Action.ADDPLAYER:
      success = AddPlayer(input1);
      break;

    case Action.REMOVEPLAYER:
      success = RemovePlayer(input1);
      break;

    case Action.SUBMITSERIES:
      success = SubmitSeries();
      break;

    case Action.SWAPSERIESPLAYERS:
      success = SwapSeriesPlayers();
      break;

    case Action.PROMOTEKNIGHT:
      success = PromoteKnight(input1);
      break;
  }

  if (success)
  {
    RunSuccess(action, runtime);
  }

  Tools.SortSheets();
}

function RunError(message)
{
  ManagementLogSheet.getRange("B4").setValue(message);
  ManagementLogSheet.getRange("B4").setFontColor("#ff0000");
}

function RunProgress(message)
{
  ManagementLogSheet.getRange("B4").setValue(message);
  ManagementLogSheet.getRange("B4").setFontColor("#ffff00");
}

function RunSuccess(action, runtime)
{
  ManagementLogSheet.getRange("B1").setValue("Select Action");
  ManagementLogSheet.getRange("B4").setValue("Execution Successful!");
  ManagementLogSheet.getRange("B4").setFontColor("#00ff00");
  ManagementLogSheet.getRange("A2:B3").clearContent();
  FullLogSheet.appendRow([new Date(), "onClickRun", action + " Time used: " + ((new Date()).getTime() - runtime) / 1000 + "secs"]);
}

function AddPlayer(input)
{
  var newplayer = new Player(input);
  return newplayer.Add();
}

function RemovePlayer(input)
{
  var removeplayer = Player.Fetch(input);
  if (removeplayer == undefined)
  {
    RunError("Player not selected")
    return false;
  }
  return removeplayer.Remove();
}

function SubmitSeries()
{
  var success = true;
  var serieslist = GetValidateList();
  var processed = 0;
  for (k = 0; k < serieslist.length; k++)
  {
    if (serieslist[k].isValid())
    {
      serieslist[k].Submit();
      RankList.Update(serieslist[k]);
      RunProgress("Series Processed: " + (k + 1) + "/" + serieslist.length);
      processed++;
    }
    else
    {
      RunError("Invalid Series Detected!");
      success = false;
      break;
    }
  }
  if (success && processed > 0)
  {
    RunProgress("Posting Webhooks");
    PostSeriesInstructionWebhook();
    RankList.PostWebhook();
    RunProgress("Updating Player Stats");
  }
  if (processed > 0)
  {
    UpdateRankList();
    UpdatePlayerList();
    ManagementLogSheet.appendRow([new Date(), "Series Submission", JSON.stringify({ SeriesProcessed: processed, TimeUsed: (((new Date()).getTime() - runtime) / 1000) })]);
    return success;
  }
}

function SwapSeriesPlayers()
{
  var seriesData = ValidationSheet.getRange(2, 3, 1, 4).getValues()[0];
  ValidationSheet.getRange(2, 3, 1, 4).setValues([[seriesData[1], seriesData[0], seriesData[3], seriesData[2]]]);
  ManagementLogSheet.appendRow([new Date(), "Swap Series Players", JSON.stringify({ "From": seriesData, "To": [seriesData[1], seriesData[0], seriesData[3], seriesData[2]] })]);
  return true;
}

function PromoteKnight(input)
{
  var player = Player.Fetch(input);
  if (player == undefined)
  {
    RunError("Player not selected")
    return false;
  }
  player.PromoteKnight();
  ManagementLogSheet.appendRow([new Date(), "Knight Promotion", JSON.stringify(player)]);
  return true;
}

function PostSeriesInstructionWebhook()
{
  var payload =
    {
      "content": "For MKOTH related commands: `.mkothhelp` (Beta)",
      "embeds":
      [
        {
          "author": { "name": "RULES OF SERIES SUBMISSION", "icon_url": "https://cdn.discordapp.com/attachments/341163606605299716/352709311442452490/checklist.png" },
          "title": null,
          "description": "ᅠ",
          "timestamp": new Date(),
          "footer": { "text": "Updated" },
          "fields":
          [
            { "name": "1. Only winners will submit the series", "value": "Prepare one of the game invite codes used for the series and your submission ID (DM a <@&347261793393049630>\"`Yay`\" if you do not have one), submit a series by using the form provided below.", "inline": false },
            { "name": "2. The earlier you submit your series the better", "value": "E.g Player A completes his series with player B on 10/13/16, and submits their series on the same day. Player C and player D completes their series on 9/10/16 but submits their submits series on 11/13/16, it will be recorded that player A and B played their series first.", "inline": false },
            { "name": "3. Double check your submitted series below", "value": "If you accidentally submitted a series with wrong information, approach a manager IMMEDIATELY as severe errors cannot be undone. If the your entered submission ID does not match the one provided by us, the submission will be automatically rejected. Only if your series is auto rejected, please check your ID and submit again.", "inline": false },
            { "name": "4. Rankings are usually updated once daily", "value": "Your submitted series will not be reflected immediately on the ranking sheet. They will append below to be checked. All auto-generated validation messages below are based on the last ranking update, so in rare cases, conflicts might occur as the validation check does not take into account any pending series.", "inline": false },
            { "name": "5. No falsification", "value": "SUBMITTING A FALSE SERIES WILL RESULT IN A PERMANENT BAN FROM MKOTH.\nᅠ", "inline": false },
            { "name": "Rank and Player Stats", "value": "Google Sheets: [MKOTH Series Data](https://docs.google.com/spreadsheets/d/1VRfWwvRSMQizzBanGNRMFVzoYFthrsNKzOgF5wKVM5I)", "inline": false },
            { "name": "Series Submission Form", "value": "Google Forms: [MKOTH Series Submission Form](https://docs.google.com/forms/d/e/1FAIpQLSdGJnCOl0l5HjxuYexVV_sOKPR1iScq3eiSxGiqKULX3zG4-Q/viewform)\nᅠ", "inline": false },
            { "name": "Attributions", "value": "Icons made by [Vectors Market](https://www.flaticon.com/authors/vectors-market) and [Freepik](http://www.freepik.com) from [Flaticon](https://www.flaticon.com) is licensed by [CC 3.0 BY](http://creativecommons.org/licenses/by/3.0/)", "inline": false }
          ],
          "color": 9803157
        }
      ]
    };
  SendWebHook(payload);
}

function SendWebHook(payload)
{
  try
  {
    var options =
      {
        'method': 'post',
        'contentType': 'application/json',
        'payload': JSON.stringify(payload)
      }
    var response = UrlFetchApp.fetch(Webhookurl, options);
    var responseobj = JSON.parse(JSON.stringify(response.getHeaders()));
    if (Number(responseobj["x-ratelimit-remaining"]) <= 1) 
    {
      Utilities.sleep((responseobj["x-ratelimit-reset"]) * 1000 - Date.parse(responseobj["Date"]));
    }
  }
  catch (error)
  {
    RunError(error.message);
  }
}