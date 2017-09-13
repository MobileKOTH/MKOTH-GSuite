//Action ENUMS
var Action =
  {
    SELECT: "Select Action",
    ADDPLAYER: "Add Player",
    REMOVEPLAYER: "Remove Player",
    SUBMITSERIES: "Submit Series",
    SWAPSERIESPLAYERS: "Swap Series Players",
    PROMOTEKNIGHT: "Promote Knight"
  }

var Comfirmation =
  {
    YES: "Run",
    NO: "NOT Run"
  }

var runtime = new Date().getTime();

//Running of Management Action
function onClickRun()
{
  runtime = new Date().getTime();

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
  FullLogSheet.sort(1, false);
  ManagementLogSheet.sort(1, false);
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
  var removeplayer = new Player(input);
  return removeplayer.Remove();
}

function SubmitSeries()
{
  var success = true;
  var serieslist = GetValidateList();
  var ranklist = new RankList();
  var processed = 0;
  for (k = 0; k < serieslist.length; k++)
  {
    if (serieslist[k].isValid())
    {
      ranklist = new RankList();
      serieslist[k].Submit();
      serieslist[k].ReloadPlayers();
      ranklist.Update(serieslist[k]);
      RunProgress("Series Processed: " + (k + 1) + "/" + serieslist.length);
      ValidationSheet.deleteRows(2, 1);
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
    RunProgress("Updating Player Stats");
    ranklist = new RankList();
    PostSeriesInstructionWebhook();
    ranklist.PostWebhook();
  }
  if (processed > 0)
  {
    var rankingarr = GetRankList();
    var ranklistarr = [];
    var realrank = 1;
    for (n = 0; n < rankingarr.length; n++)
    {
      if (rankingarr[n].player.isRemoved == false)
      {
        var classStr = rankingarr[n].player.class;
        if (rankingarr[n].player.isKnight)
        {
          classStr = rankingarr[n].player.class + " (Knight)";
        }
        ranklistarr.push([realrank, rankingarr[n].player.name, classStr, rankingarr[n].player.points]);
        realrank++;
      }
    }
    RankingSheet.getRange(2, 1, RankingSheet.getLastRow() - 1, RankingSheet.getLastColumn()).clearContent();
    RankingSheet.getRange(2, 1, ranklistarr.length, RankingSheet.getLastColumn()).setValues(ranklistarr);
    UpdatePlayerlist();
    ManagementLogSheet.appendRow([new Date(), "Series Submission", "Series Processed: " + processed + " Time used: " + ((new Date()).getTime() - runtime) / 1000 + "secs"]);
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
  var player = new Player(input);
  player.LoadPlayerData();
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
          "thumbnail": { "url": "https://cdn.discordapp.com/attachments/271109067261476866/330727796647395330/Untitled12111.jpg" },
          "author": { "name": "RULES OF SERIES SUBMISSION", "icon_url": "https://cdn.discordapp.com/attachments/341163606605299716/352709311442452490/checklist.png" },
          "title": "Only winners will submit the series",
          "description":
          "1. Select the exact ranking names of you and your opponent.\n\n" +
          "2. The earlier you submit your series the better. E.g Player A completes his series with player B on 10/13/16, and submits their series on the same day. Player C and player D completes their series on 9/10/16 but submits their submits series on 11/13/16, it will be recorded that player A and B played their series first.\n\n" +
          "3. If you accidentally submit a series with wrong information, approach a manager IMMEDIATELY as severe errors cannot be undone.\n\n" +
          "4. SUBMITTING A FALSE SERIES WILL RESULT IN A PERMANENT BAN FROM MKOTH.\n",
          "timestamp": new Date(),
          "footer": { "text": "Updated" },
          "fields":
          [
            {
              "name": "Rank and Player Stats",
              "value": "Weblink: [MKOTH Series Data](https://docs.google.com/spreadsheets/d/1VRfWwvRSMQizzBanGNRMFVzoYFthrsNKzOgF5wKVM5I)",
              "inline": false
            },
            {
              "name": "Series Submission Form",
              "value": "Weblink: [MKOTH Series Submission Form](https://docs.google.com/forms/d/e/1FAIpQLSdGJnCOl0l5HjxuYexVV_sOKPR1iScq3eiSxGiqKULX3zG4-Q/viewform)",
              "inline": false
            },
            {
              "name": "Raw Series Submissions",
              "value": "Weblink: [MKOTH Series Pending and Validations](https://docs.google.com/spreadsheets/d/1zQMN_t94oS55TwO5kI7p-QRkJti0dRwvGwEuGqkxMY4)",
              "inline": false
            },
            {
              "name": "Attributions",
              "value": "Icons made by [Vectors Market](https://www.flaticon.com/authors/vectors-market) and [Freepik](http://www.freepik.com) from [Flaticon](https://www.flaticon.com) is licensed by [CC 3.0 BY](http://creativecommons.org/licenses/by/3.0/)",
              "inline": false
            }
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
    RunProgress("Posting Webhooks");
    if (Number(responseobj["x-ratelimit-remaining"]) == 1) 
    {
      Utilities.sleep(Math.abs((responseobj["x-ratelimit-reset"]) * 1000 - new Date().getTime()));
    }
  }
  catch (error)
  {
    RunError(error.message);
  }
}

function SendTestWebHook(payload)
{
  var success = true;
  try
  {
    var options =
      {
        'method': 'post',
        'contentType': 'application/json',
        'payload': JSON.stringify(payload)
      }
    var response = UrlFetchApp.fetch(Webhooktesturl, options);
    var responseobj = JSON.parse(JSON.stringify(response.getHeaders()));
    if (Number(responseobj["x-ratelimit-remaining"]) == 1) 
    {
      Utilities.sleep(Math.abs((responseobj["x-ratelimit-reset"]) * 1000 - new Date().getTime()));
    }
  }
  catch (error)
  {
    RunError(error.message);
    success = false;
  }
  return success;
}
