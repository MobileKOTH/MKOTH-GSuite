/**
 * 
 * @param {Player} player 
 */
function Ranking(player)
{
  this.player = player;
  this.rankChanges = 0;
  this.pointChanges = 0;

  this.GetRankChangesText = function ()
  {
    this.rankChanges = this.player.oldrank - this.player.rank;
    if (this.rankChanges == 0) 
    {
      return "";
    }
    if (this.rankChanges > 0) 
    {
      return " ▲" + this.rankChanges + " ";
    }
    else
    {
      return " ▼" + this.rankChanges + " ";
    }
  }
  this.GetPointChangesText = function ()
  {
    this.pointChanges = this.player.points - this.player.oldpoints;
    if (this.pointChanges == 0) 
    {
      return "p**";
    }
    if (this.pointChanges > 0) 
    {
      return "p** **▵**" + this.pointChanges + " ";
    }
    else
    {
      return "p** **▿**" + this.pointChanges + " ";
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
    var sheeturl = "https://docs.google.com/spreadsheets/d/1VRfWwvRSMQizzBanGNRMFVzoYFthrsNKzOgF5wKVM5I";
    var fields = [];
    fields.push({
      "name": ":crown: King: " + this.list[0].player.name + this.list[0].GetRankChangesText(),
      "value": " <@!" + this.list[0].player.discordid + "> **" + this.list[0].player.points + this.list[0].GetPointChangesText() + "\n",
      "inline": false
    });
    for (var ni = 0; ni < this.list.length; ni++)
    {
      var element = this.list[ni];
      if (element.player.isKnight) 
      {
        fields.push({
          "name": ":shield: Knight: " + element.player.name + " #" + element.player.rank + element.GetRankChangesText(),
          "value": " <@!" + element.player.discordid + "> **" + element.player.points + element.GetPointChangesText() + "\n",
          "inline": false
        });
      }
    }
    for (var ni = 1; ni < this.list.length; ni++)
    {
      var element = this.list[ni];
      if (element.player.class == PlayerClass.NOBLEMAN) 
      {
        fields.push({
          "name": ":trophy: Nobleman: " + element.player.name + " #" + element.player.rank + element.GetRankChangesText(),
          "value": " <@!" + element.player.discordid + "> **" + element.player.points + element.GetPointChangesText() + "\n",
          "inline": false
        });
      }
    }
    var payload =
      {
        "username": "MKOTH Rankings",
        "avatar_url": "https://cdn.discordapp.com/attachments/341163606605299716/352269545030942720/mkoth_thumb.jpg",
        "content": "**May not be mobile friendly.**\nDM a manager if your discord ID missing and has no numbers.",
        "embeds":
        [
          {
            "author":
            {
              "name": "MKOTH Elites",
              "icon_url": "https://cdn.discordapp.com/attachments/341163606605299716/352026213306335234/crown.png",
              "url": sheeturl
            },
            "title": null,
            "description": "The ranking system consists of the :crown:**King**, who is in rank 1, and 4 different classes of players.\n" +
            "**Knights** are the strongest players in Mobile King of the Hill and protect their King and the Noblemen. " +
            "You can challenge one of the Knights into a best of 5 knight series but that will cost you 18 points.\n" +
            "If you succeed beating one of the strong Knights, you are officially one of the mighty Noblemen in Mobile King of the Hill.\n" +
            "Knights are chosen manually.\n" +
            "**Nobleman** may challenge the King’s position by playing a best of 5 **King Series** with him and with the cost of 15 points.",
            "fields": fields,
            "color": 16772608
          }
        ]
      };
    SendWebHook(payload);

    fields = [];
    for (var si = 0; si < this.list.length; si++)
    {
      var element = this.list[si];
      if (element.player.class == PlayerClass.SQUIRE && element.player.rank <= 20) 
      {
        fields.push({
          "name": "#" + element.player.rank + " " + element.player.name + element.GetRankChangesText(),
          "value": " <@!" + element.player.discordid + "> **" + element.player.points + element.GetPointChangesText() + "\n",
          "inline": false
        });
      }
    }
    var fields2 = [];
    for (var si = 0; si < this.list.length; si++)
    {
      var element = this.list[si];
      if (element.player.class == PlayerClass.SQUIRE && element.player.rank > 20) 
      {
        fields2.push({
          "name": "#" + element.player.rank + " " + element.player.name + element.GetRankChangesText(),
          "value": " <@!" + element.player.discordid + "> **" + element.player.points + element.GetPointChangesText() + "\n",
          "inline": false
        });
      }
    };
    var payload =
      {
        "username": "MKOTH Rankings",
        "avatar_url": "https://cdn.discordapp.com/attachments/341163606605299716/352269545030942720/mkoth_thumb.jpg",
        "content": null,
        "embeds":
        [
          {
            "author":
            {
              "name": "Squires",
              "icon_url": "https://cdn.discordapp.com/attachments/341163606605299716/352093192918663171/swords.png",
              "url": sheeturl
            },
            "title": null,
            "description": "This class includes players who are on or below rank 30 but has not won at least one **Knight Series** as a challenger. " +
            "Hence, this class behaves differently from the previous 2 classes. " +
            "The number of players in this class may decrease as more people beat Knights to enter the Nobleman class. " +
            "This class will no longer become smaller when it has 20 players. ",
            "fields": fields,
            "color": 34304
          },
          {
            "author":
            {
              "name": "Squires",
              "icon_url": "https://cdn.discordapp.com/attachments/341163606605299716/352093192918663171/swords.png",
              "url": sheeturl
            },
            "title": null,
            "description": null,
            "fields": fields2,
            "color": 34304
          }
        ]
      };
    SendWebHook(payload);

    fields = [];
    for (var si = 0; si < this.list.length; si++)
    {
      var element = this.list[si];
      if (element.player.class == PlayerClass.VASSAL) 
      {
        fields.push({
          "name": "#" + element.player.rank + " " + element.player.name + element.GetRankChangesText(),
          "value": " <@!" + element.player.discordid + "> **" + element.player.points + element.GetPointChangesText() + "\n",
          "inline": false
        });
      }
    }
    var payload =
      {
        "username": "MKOTH Rankings",
        "avatar_url": "https://cdn.discordapp.com/attachments/341163606605299716/352269545030942720/mkoth_thumb.jpg",
        "content": null,
        "embeds":
        [
          {
            "author":
            {
              "name": "Vassals",
              "icon_url": "https://cdn.discordapp.com/attachments/341163606605299716/352093197335265296/sword.png",
              "url": sheeturl
            },
            "title": null,
            "description": "The third highest class is the Vassals class. This class includes all players under rank 30 to rank 50. " +
            "If you want to move to a higher class, you need to pay an extra fee of 12 points to start a **Ranked Series with a Squire**.",
            "fields": fields,
            "color": 16770666
          }
        ]
      };
    SendWebHook(payload);

    fields = [];
    for (var si = 0; si < this.list.length; si++)
    {
      if (fields.length >= 25)
      {
        break;
      }
      var element = this.list[si];
      if (element.player.class == PlayerClass.PEASANT) 
      {
        fields.push({
          "name": "#" + element.player.rank + " " + element.player.name + element.GetRankChangesText(),
          "value": " <@!" + element.player.discordid + "> **" + element.player.points + element.GetPointChangesText() + "\n",
          "inline": false
        });
      }
    }
    var payload =
      {
        "username": "MKOTH Rankings",
        "avatar_url": "https://cdn.discordapp.com/attachments/341163606605299716/352269545030942720/mkoth_thumb.jpg",
        "content": null,
        "embeds":
        [
          {
            "author":
            {
              "name": "Peasants",
              "icon_url": "https://cdn.discordapp.com/attachments/341163606605299716/352093195087380482/axe.png",
              "url": sheeturl
            },
            "title": null,
            "description": "The lowest class in the ranking is the Peasant class. This class includes all players under rank 50. " +
            "If you want to move to a higher class, you need to pay an extra fee of 6 points to start a **Ranked Series with a Vassal**.",
            "fields": fields,
            "timestamp": new Date(),
            "footer":
            {
              "text": "Updated",
            },
            "color": 16777215
          }
        ]
      };
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