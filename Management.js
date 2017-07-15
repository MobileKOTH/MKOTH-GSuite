//Action ENUMS
var Action = 
{
  SELECT : "Select Action",
  ADDPLAYER : "Add Player",
  REMOVEPLAYER : "Remove Player",
  SUBMITSERIES : "Submit Series"
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
  if (action == "Select Action")
  {
    RunError("No Action Selected!");
  }
  if (action == "Add Player")
  {
    success = AddPlayer(input1);
  }
  if (action == "Remove Player")
  {
    success = RemovePlayer(input1);
  }
  if (action == "Submit Series")
  {
    success = SubmitSeries();
  }
  if (action == "Promote Knight")
  {
    success = PromoteKnight(input1);
  }
  if (action == "Rebuild Ranking")
  {
    success = RebuildRank();
  }

  if (success)
  {
    RunSuccess(action, runtime);
  }
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
  var processed = 0;
  for (k = 0; k < serieslist.length; k++)
  {
    if (serieslist[k].isValid())
    {
      var ranklist = new RankList();
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
  }
  if (processed > 0)
  {
    var ranklist = GetRankList();
    var ranklistarr = [];
    var realrank = 1;
    for (n = 0; n < ranklist.length; n++)
    {
      if (ranklist[n].player.isRemoved == false)
      {
        var classStr = ranklist[n].player.class;
        if (ranklist[n].player.isKnight)
        {
          classStr = ranklist[n].player.class + " (Knight)";
        }
        ranklistarr.push([realrank, ranklist[n].player.name, classStr, ranklist[n].player.points]);
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

function PromoteKnight(input)
{
  var player = new Player(input);
  player.LoadPlayerData();
  player.PromoteKnight();
  ManagementLogSheet.appendRow([new Date(), "Knight Promotion", JSON.stringify(player)]);
  return true;
}
