/**
 * 
 * @param {Player} player 
 */
function Ranking(player)
{
  this.player = player;
  this.oldPoints = player.points;
  this.oldRank = player.rank;
  this.rankChanges = 0;
  this.pointChanges = 0;

  this.GetRankChangesText = function ()
  {
    this.rankChanges = this.oldRank - this.player.rank;
    if (this.rankChanges == 0) 
    {
      return " － ";
    }
    if (this.rankChanges > 0) 
    {
      return ":arrow_up_small:*" + this.rankChanges + "* ";
    }
    else
    {
      return ":small_red_triangle_down:*" + this.rankChanges + "* ";
    }
  }
  this.GetPointChangesText = function ()
  {
    this.pointChanges = this.player.points - this.oldPoints;
    if (this.pointChanges == 0) 
    {
      return " － ";
    }
    if (this.pointChanges > 0) 
    {
      return ":arrow_up_small:*" + this.pointChanges + "* ";
    }
    else
    {
      return ":small_red_triangle_down:*" + this.pointChanges + "* ";
    }
  }
}

function RankList()
{
  this.list = GetRankList();

  this.GetLastNoblemanPosition = function ()
  {
    for (m = 0; m < this.list.length; m++)
    {
      if (this.list[m].player.class == "Squire")
      {
        return m;
      }
    }
    return 1;
  }

  this.Update = function (newseries)
  {
    newseries.UpdatePlayers();
    if (newseries.type == "Ranked")
    {
      if (newseries.GetWinner() == newseries.player1)
      {
        var rankjumper = this.list.splice(newseries.player1.rank - 1, 1);
        this.list.splice(newseries.player2.rank - 1, 0, rankjumper[0]);
        ManagementLogSheet.appendRow([new Date(), "Rank change", "Player: " + newseries.player1.name + " Old Position: " + newseries.player1.rank + " New Position: " + newseries.player2.rank]);
      }
    }
    if (newseries.type == "King")
    {
      if (newseries.GetWinner() == newseries.player1)
      {
        var rankjumper = this.list.splice(newseries.player1.rank - 1, 1);
        this.list.splice(0, 0, rankjumper[0]);
        ManagementLogSheet.appendRow([new Date(), "King change", "New King: " + newseries.player1.name + " Old Position: " + newseries.player1.rank]);
        this.list[1].player.SetClass("Nobleman");
      }
    }
    if (newseries.type == "Knight")
    {
      if (newseries.GetWinner() == newseries.player1)
      {
        var rankjumper = this.list.splice(newseries.player1.rank - 1, 1);
        this.list.splice(this.GetLastNoblemanPosition(), 0, rankjumper[0]);
        ManagementLogSheet.appendRow([new Date(), "Nobleman Earned", "Player: " + newseries.player1.name + " Old Position: " + newseries.player1.rank + " New Position: " + (this.GetLastNoblemanPosition() + 1)]);
        this.list[this.GetLastNoblemanPosition()].player.SetClass("Nobleman");
      }
    }
    this.Refresh();
  }

  this.Refresh = function ()
  {
    for (n = 0; n < this.list.length; n++)
    {
      this.list[n].player.rank = n + 1;
      this.list[n].player.RefreshClass();
    }
    var ranklistarr = [];
    for (n = 0; n < this.list.length; n++)
    {
      var classStr = this.list[n].player.class;
      if (this.list[n].player.isKnight)
      {
        classStr = this.list[n].player.class + " (Knight)";
      }
      ranklistarr.push([n + 1, this.list[n].player.name, classStr, this.list[n].player.points]);
    }
    RankingSheet.getRange(2, 1, ranklistarr.length, RankingSheet.getLastColumn()).setValues(ranklistarr);
  }

  this.PostWebhook = function ()
  {
    PostSeriesInstructionWebhook();
    var sheeturl = "https://docs.google.com/spreadsheets/d/1VRfWwvRSMQizzBanGNRMFVzoYFthrsNKzOgF5wKVM5I";
    var description = "";
    for (var ni = 1; ni < this.list.length; ni++)
    {
      var element = this.list[ni];
      if (element.player.class == PlayerClass.NOBLEMAN) 
      {
        description += element.player.rank + element.GetRankChangesText() + element.player.name +
          " <@!" + element.player.discordid + "> " + element.player.points + element.GetPointChangesText() + "\n";
      }
    }
    var payload =
      {
        "content": "**RANKINGS**",
        "embeds":
        [
          {
            "author":
            {
              "name": "King" + this.list[0].GetRankChangesText() + this.list[0].player.name + " - " + this.list[0].player.points + this.list[0].GetPointChangesText(),
              "icon_url": "https://cdn.discordapp.com/attachments/341163606605299716/352026213306335234/crown.png",
            },
            "url": sheeturl,
            "title": "Nobles",
            "description": description,
            "color": 16772608
          }
        ]
      }
    SendWebHook(payload);

    description = "";
    for (var si = 0; si < this.list.length; si++)
    {
      var element = this.list[si];
      if (element.player.class == PlayerClass.SQUIRE) 
      {
        description += element.player.rank + element.GetRankChangesText() + element.player.name +
          " <@!" + element.player.discordid + "> " + element.player.points + element.GetPointChangesText() + "\n";
      }
    }
    var payload =
      {
        "content": null,
        "embeds":
        [
          {
            "author":
            {
              "name": "|",
              "icon_url": "https://cdn.discordapp.com/attachments/341163606605299716/352093192918663171/swords.png",
            },
            "url": sheeturl,
            "title": "Squires",
            "description": description,
            "color": 34304
          }
        ]
      }
    SendWebHook(payload);

    description = "";
    for (var si = 0; si < this.list.length; si++)
    {
      var element = this.list[si];
      if (element.player.class == PlayerClass.VASSAL) 
      {
        description += element.player.rank + element.GetRankChangesText() + element.player.name +
          " <@!" + element.player.discordid + "> " + element.player.points + element.GetPointChangesText() + "\n";
      }
    }
    var payload =
      {
        "content": null,
        "embeds":
        [
          {
            "author":
            {
              "name": "|",
              "icon_url": "https://cdn.discordapp.com/attachments/341163606605299716/352093197335265296/sword.png",
            },
            "url": sheeturl,
            "title": "Vassals",
            "description": description,
            "color": 16770666
          }
        ]
      }
    SendWebHook(payload);

    description = "";
    for (var si = 0; si < this.list.length; si++)
    {
      if (description.length > 1920)
      {
        break;
      }
      var element = this.list[si];
      if (element.player.class == PlayerClass.PEASANT) 
      {
        description += element.player.rank + element.GetRankChangesText() + element.player.name +
          " <@!" + element.player.discordid + "> " + element.player.points + element.GetPointChangesText() + "\n";
      }
    }
    var payload =
      {
        "content": null,
        "embeds":
        [
          {
            "author":
            {
              "name": "|",
              "icon_url": "https://cdn.discordapp.com/attachments/341163606605299716/352093195087380482/axe.png",
            },
            "url": sheeturl,
            "title": "Peasants",
            "description": description,
            "color": 16777215
          }
        ]
      }
    SendWebHook(payload);
  }
}

function RebuildRank()
{
  var rankinglist = [];
  var playerDB = GetPlayerlistCache();
  RunProgress("1%: Gathering Player Data");
  for (l = 0; l < playerDB.length; l++)
  {
    rankinglist.push(new Ranking(playerDB[l]));
    rankinglist[l].player.rank = l + 1;
    rankinglist[l].player.Reset();
    rankinglist[l].player.RefreshClass();
  }
  RunProgress("5%: Resetting All Data");
  var ranklistarr = [];
  for (n = 0; n < rankinglist.length; n++)
  {
    ranklistarr.push([n + 1, rankinglist[n].player.name, rankinglist[n].player.class, rankinglist[n].player.points]);
  }
  RankingSheet.getRange(2, 1, ranklistarr.length, RankingSheet.getLastColumn()).setValues(ranklistarr);
  RunProgress("10%: Loading Series History");
  var serieslist = GetSeriesList();
  for (r = 0; r < serieslist.length; r++)
  {
    var ranklist = new RankList();
    serieslist[r].ReloadPlayers();
    ranklist.Update(serieslist[r]);
    RunProgress("Series Rebuilded: " + (r + 1) + "/" + serieslist.length);
  }
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
  RunProgress("95%: Rebuilded Rank");
  RankingSheet.getRange(2, 1, RankingSheet.getLastRow() - 1, RankingSheet.getLastColumn()).clearContent();
  RankingSheet.getRange(2, 1, ranklistarr.length, RankingSheet.getLastColumn()).setValues(ranklistarr);
  RunProgress("99%: Updating Player Stats");
  UpdatePlayerlist();
  var newranklist = new RankList();
  newranklist.list = GetPurgedRankList();
  newranklist.Refresh();
  return true;
}

/**
 * @returns {Ranking[]}
 */
function GetRankList()
{
  var rankinglist = [];
  var playerDB = GetPlayerlistCache();
  for (l = 0; l < playerDB.length; l++)
  {
    for (ll = 0; ll < playerDB.length; ll++)
    {
      if (playerDB[ll].rank == l + 1)
      {
        rankinglist.push(new Ranking(playerDB[ll]))
        break;
      }
    }
  }
  return rankinglist;
}

function GetPurgedRankList()
{
  var rankinglist = [];
  var playerDB = GetPlayerList();
  for (l = 0; l < playerDB.length; l++)
  {
    for (ll = 0; ll < playerDB.length; ll++)
    {
      if (playerDB[ll].rank == l + 1)
      {
        rankinglist.push(new Ranking(playerDB[ll]))
        break;
      }
    }
  }
  return rankinglist;
}