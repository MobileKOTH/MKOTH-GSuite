function Ranking(player)
{
  this.player = player;
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