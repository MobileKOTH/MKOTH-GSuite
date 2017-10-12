/**
 * A ranking position data
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
      return " :arrow_up:" + this.rankChanges + " ";
    }
    else
    {
      return " :arrow_down:" + this.rankChanges + " ";
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
      return "p** `▲" + this.pointChanges + "` ";
    }
    else
    {
      return "p** `▼" + this.pointChanges + "` ";
    }
  }

  this.GetELOText = function ()
  {
    return " | ELO " + ((this.player.GetELO().games >= StatsType.MINIMUMGAMESELO) ? this.player.GetELO().value.toPrecision(6) : ("TBD:" + Tools.NumberPadding((StatsType.MINIMUMGAMESELO - this.player.GetELO().games), 2)));
  }
}

var RankList = new RankingList();

function RankingList()
{
  this.list = GetRankList();

  this.GetLastNoblemanPosition = function ()
  {
    for (m = 0; m < this.list.length; m++)
    {
      if (this.list[m].player.class == PlayerClass.SQUIRE)
      {
        return m;
      }
    }
    return 1;
  }

  /**
   * Update the ranking after a series input
   * @param {Series} newseries
   */
  this.Update = function (newseries)
  {
    newseries.UpdatePlayers();
    if (newseries.type == SeriesType.RANKED)
    {
      if (newseries.GetWinner() == newseries.player1)
      {
        var rankjumper = this.list.splice(newseries.player1.rank - 1, 1);
        this.list.splice(newseries.player2.rank - 1, 0, rankjumper[0]);
        ManagementLogSheet.appendRow([new Date(), "Rank Change", JSON.stringify({ Player: newseries.player1.name, OldPosition: newseries.player1.rank, NewPosition: newseries.player2.rank })]);
      }
    }
    if (newseries.type == SeriesType.KING)
    {
      if (newseries.GetWinner() == newseries.player1)
      {
        var rankjumper = this.list.splice(newseries.player1.rank - 1, 1);
        this.list.splice(0, 0, rankjumper[0]);
        ManagementLogSheet.appendRow([new Date(), "King Change", JSON.stringify({ NewKing: newseries.player1.name, OldPosition: newseries.player1.rank })]);
        this.list[1].player.class = PlayerClass.NOBLEMAN;
      }
    }
    if (newseries.type == SeriesType.KNIGHT)
    {
      if (newseries.GetWinner() == newseries.player1)
      {
        var rankjumper = this.list.splice(newseries.player1.rank - 1, 1);
        this.list.splice(this.GetLastNoblemanPosition(), 0, rankjumper[0]);
        ManagementLogSheet.appendRow([new Date(), "Nobleman Earned", JSON.stringify({ Player: newseries.player1.name, OldPosition: newseries.player1.rank, NewPosition: (this.GetLastNoblemanPosition() + 1) })]);
        this.list[this.GetLastNoblemanPosition()].player.class = PlayerClass.NOBLEMAN;
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
  }

  /**
   * @param {String} playername
   */
  this.PurgePlayer = function (playername)
  {
    for (var rl = 0; rl < this.list.length; rl++)
    {
      var element = this.list[rl];
      if (element.player.name == playername)
      {
        this.list.splice(rl, 1);
      }
    }
    this.Refresh();
  }

  this.PostWebhook = function ()
  {
    GetSeriesELO(StatsType.MAIN);

    var sheeturl = "https://docs.google.com/spreadsheets/d/1VRfWwvRSMQizzBanGNRMFVzoYFthrsNKzOgF5wKVM5I";
    var fields = [];
    fields.push({
      "name": ":crown: King: " + this.list[0].player.name + this.list[0].GetRankChangesText() + this.list[0].GetELOText(),
      "value": " <@!" + this.list[0].player.discordid + "> **" + this.list[0].player.points + this.list[0].GetPointChangesText() + "\n",
      "inline": false
    });

    for (var ni = 1; ni < this.list.length; ni++)
    {
      var element = this.list[ni];
      if (element.player.class == PlayerClass.NOBLEMAN) 
      {
        fields.push({
          "name": ":champagne_glass: Nobleman: " + element.player.name + " #" + element.player.rank + element.GetRankChangesText() + element.GetELOText(),
          "value": " <@!" + element.player.discordid + "> **" + element.player.points + element.GetPointChangesText() + "\n",
          "inline": false
        });
      }
    }

    for (var ni = 0; ni < this.list.length; ni++)
    {
      var element = this.list[ni];
      if (element.player.isKnight) 
      {
        fields.push({
          "name": ":shield: Knight: " + element.player.name + " #" + element.player.rank + element.GetRankChangesText() + element.GetELOText(),
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
            "description": "The ranking system consists of the :crown: **King**, who is in rank 1, and 4 different classes of players.\n" +
            ":shield: **Knights** are the strongest players in Mobile King of the Hill and protect their King and the Noblemen. " +
            "You can challenge one of the Knights into a best of 5 knight series but that will cost you 18 points.\n" +
            "If you succeed beating one of the strong Knights, you are officially one of the mighty Noblemen in Mobile King of the Hill.\n" +
            "Knights are chosen manually.\n" +
            ":champagne_glass: **Nobleman** may challenge the King’s position by playing a best of 5 **King Series** with him and with the cost of 15 points.",
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
          "name": "#" + element.player.rank + " " + element.player.name + element.GetRankChangesText() + element.GetELOText(),
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
          "name": "#" + element.player.rank + " " + element.player.name + element.GetRankChangesText() + element.GetELOText(),
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
          "name": "#" + element.player.rank + " " + element.player.name + element.GetRankChangesText() + element.GetELOText(),
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
          "name": "#" + element.player.rank + " " + element.player.name + element.GetRankChangesText() + element.GetELOText(),
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

/**
 * @returns {Ranking[]}
 */
function GetRankList()
{
  var ranklist = [];
  for (l = 0; l < PlayerList.length; l++)
  {
    for (ll = 0; ll < PlayerList.length; ll++)
    {
      if (PlayerList[ll].rank == l + 1)
      {
        ranklist.push(new Ranking(PlayerList[ll]))
        break;
      }
    }
  }
  return ranklist;
}

function UpdateRankList()
{
  var ranklistarr = [];
  for (n = 0; n < RankList.list.length; n++)
  {
    var classStr = (RankList.list[n].player.isKnight) ? RankList.list[n].player.class + " (Knight)" : RankList.list[n].player.class;
    ranklistarr.push([n + 1, RankList.list[n].player.name, classStr, RankList.list[n].player.points]);
  }
  RankingSheet.getRange(2, 1, RankingSheet.getLastRow() - 1, 4).clearContent();
  RankingSheet.getRange(2, 1, ranklistarr.length, 4).setValues(ranklistarr);
}