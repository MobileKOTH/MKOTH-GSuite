//Player ENUMS
var PlayerClass =
  {
    //Player class constants
    KING: "King",
    KNIGHT: "Knight",
    NOBLEMAN: "Nobleman",
    SQUIRE: "Squire",
    VASSAL: "Vassal",
    PEASANT: "Peasant",
    KNIGHT: " (Knight)"
  }

var ClassRank =
  {
    //The max cap rank possition of a class
    KING: 1,
    NOBLEMAN: 10,
    SQUIRE: 30,
    VASSAL: 50
  }

var Playerlist = GetPlayerList();

/**
* Represents a player.
* @class
* @param {String} name the name of the Player
*/
function Player(name)
{
  /**
   * @type {String}
   */
  this.name = name;
  this.joinDate = new Date();
  this.class = PlayerClass.SQUIRE;
  this.rank = 0;
  this.points = 0;
  this.wins = 0;
  this.loss = 0;
  this.draws = 0;
  this.discordid = 0;
  this.isKnight = false;
  this.isRemoved = false;
  this.isHoliday = false;

  /**
  * @method
  * @name Add
  * @returns {Boolean} if the addition is valid
  */
  this.Add = function ()
  {
    if (this.name == "")
    {
      RunError("Name is empty!");
      return false;
    }
    if (checkPlayerRepeat(this.name))
    {
      RunError("Player Already Registered!");
      return false;
    }

    if (RankingSheet.getLastRow() == 1)
    {
      this.class = PlayerClass.KING;
    }
    if (RankingSheet.getLastRow() > ClassRank.SQUIRE)
    {
      this.class = PlayerClass.VASSAL;
    }
    if (RankingSheet.getLastRow() > ClassRank.VASSAL)
    {
      this.class = PlayerClass.PEASANT;
    }

    this.rank = RankingSheet.getLastRow();
    PlayerStatsSheet.appendRow([this.name, this.joinDate, this.class, this.wins, this.loss, this.draws, this.GetWinrate(), this.GetGamesCount()]);
    RankingSheet.appendRow([this.rank, this.name, this.class, this.points]);

    ManagementLogSheet.appendRow([new Date(), "Add Player", JSON.stringify(this)]);
    return true;
  }

  this.Remove = function ()
  {
    this.LoadPlayerData();
    this.isRemoved = true;
    ManagementLogSheet.appendRow([new Date(), "Remove Player", JSON.stringify(this)]);
    this.rank = 0;
    this.Update();
    for (row = 1; row < PlayerStatsSheet.getLastRow(); row++)
    {
      if (PlayerStatsSheet.getRange(row, 1).getValue() == this.name)
      {
        PlayerStatsSheet.getRange(row, 11).setBackground("#ff0000");
        PlayerStatsSheet.getRange(row, 11).setValue("Removed");
        break;
      }
    }
    for (row = 1; row < RankingSheet.getLastRow(); row++)
    {
      if (RankingSheet.getRange(row, 2).getValue() == this.name)
      {
        RankingSheet.deleteRow(row);
        break;
      }
    }
    var ranklist = new RankList();
    ranklist.Refresh();
    var ranklist = GetRankList();
    var ranklistarr = [];
    var realrank = 1;
    for (n = 0; n < ranklist.length; n++)
    {
      var classStr = ranklist[n].player.class;
      if (ranklist[n].player.isKnight)
      {
        classStr = ranklist[n].player.class + " (Knight)";
      }
      ranklistarr.push([realrank, ranklist[n].player.name, classStr, ranklist[n].player.points]);
      realrank++;
    }
    RankingSheet.getRange(2, 1, ranklistarr.length, RankingSheet.getLastColumn()).setValues(ranklistarr);
    return true;
  }

  this.Reset = function ()
  {
    this.class = PlayerClass.SQUIRE;
    this.points = 0;
    this.wins = 0;
    this.loss = 0;
    this.draws = 0;
  }

  this.LoadPlayerData = function ()
  {
    for (i = 0; i < Playerlist.length; i++)
    {
      if (Playerlist[i].name.toLowerCase() == this.name.toLowerCase())
      {
        var loadedplayer = Playerlist[i];
        this.name = loadedplayer.name;
        this.joinDate = loadedplayer.joinDate;
        this.class = loadedplayer.class;
        this.rank = loadedplayer.rank;
        this.points = loadedplayer.points;
        this.wins = loadedplayer.wins;
        this.loss = loadedplayer.loss;
        this.draws = loadedplayer.draws;
        this.discordid = loadedplayer.discordid;
        this.isKnight = loadedplayer.isKnight;
        this.isRemoved = loadedplayer.isRemoved;
        this.isHoliday = loadedplayer.isHoliday;
      }
    }
  }

  this.GetWinrate = function ()
  {
    return 100 / (this.wins + this.loss) * this.wins;
  }

  this.GetGamesCount = function ()
  {
    return this.wins + this.loss + this.draws;
  }

  this.SetClass = function (newClass)
  {
    this.class = newClass;
    this.UpdateClassRank();
  }

  this.RefreshClass = function ()
  {
    if (this.rank == ClassRank.KING)
    {
      this.class = PlayerClass.KING;
    }
    if (this.rank <= ClassRank.NOBLEMAN && this.class == PlayerClass.VASSAL)
    {
      this.class = PlayerClass.SQUIRE;
    }
    if (this.rank > ClassRank.NOBLEMAN)
    {
      this.class = PlayerClass.SQUIRE;
    }
    if (this.rank > ClassRank.SQUIRE)
    {
      this.class = PlayerClass.VASSAL;
    }
    if (this.rank > ClassRank.VASSAL)
    {
      this.class = PlayerClass.PEASANT;
    }
    this.UpdateClassRank();
  }

  this.PromoteKnight = function ()
  {
    this.isKnight = true;
    this.Update();
    UpdatePlayerlist();
    var ranklist = new RankList();
    ranklist.Refresh();
  }

  this.UpdateClassRank = function ()
  {
    for (u = 0; u < Playerlist.length; u++)
    {
      if (Playerlist[u].name == this.name)
      {
        Playerlist[u].rank = this.rank;
        Playerlist[u].class = this.class;
      }
    }
  }

  this.Update = function ()
  {
    for (u = 0; u < Playerlist.length; u++)
    {
      if (Playerlist[u].name == this.name)
      {
        Playerlist[u] = this;
      }
    }
  }
}

/**
 * 
 * @param {String} name
 * @returns {Boolean}
 */
function checkPlayerRepeat(name)
{
  for (i = 0; i < Playerlist.length; i++)
  {
    if (Playerlist[i].name.toLowerCase() == name.toLowerCase())
    {
      return true;
    }
  }
  return false;
}

/**
* Get the player list from ranking and player stats
* @returns {Player[]}
*/
function GetPlayerList()
{
  var playerlist = [];
  try 
  {
    PlayerStatsSheet.sort(1);
    RankingSheet.sort(1);
    var playerDB = PlayerStatsSheet.getRange(2, 1, PlayerStatsSheet.getLastRow() - 1, 11).getValues();
    var playerRankDB = RankingSheet.getRange(2, 1, RankingSheet.getLastRow() - 1, 4).getValues();
    for (i = 0; i < playerDB.length; i++)
    {
      playerlist.push(new Player(playerDB[i][0]));
      playerlist[i].joinDate = playerDB[i][1];
      playerlist[i].class = playerDB[i][2];
      if (playerlist[i].class.indexOf("Knight") > -1)
      {
        playerlist[i].class = playerlist[i].class.replace(" (Knight)", "");
        playerlist[i].isKnight = true;
      }
      playerlist[i].wins = playerDB[i][3];
      playerlist[i].loss = playerDB[i][4];
      playerlist[i].draws = playerDB[i][5];
      playerlist[i].discordid = playerDB[i][9];
      if (playerDB[i][10] == "Removed")
      {
        playerlist[i].isRemoved = true;
        playerlist[i].rank = 0;
      }
      for (j = 0; j < playerRankDB.length; j++)
      {
        if (playerRankDB[j][1] == playerlist[i].name)
        {
          playerlist[i].rank = playerRankDB[j][0];
          playerlist[i].points = playerRankDB[j][3];
        }
      }
    }
  }
  catch (error) 
  {
    RunError(error);
  }
  return playerlist;
}

function GetPlayerlistCache()
{
  return Playerlist;
}

function UpdatePlayerlist()
{
  var playerlistarr = [];
  for (uu = 0; uu < Playerlist.length; uu++)
  {
    classStr = Playerlist[uu].class;
    if (Playerlist[uu].isKnight)
    {
      classStr = Playerlist[uu].class + " (Knight)";
    }
    playerlistarr.push([classStr, Playerlist[uu].wins, Playerlist[uu].loss, Playerlist[uu].draws, Playerlist[uu].GetWinrate(), Playerlist[uu].GetGamesCount()]);
  }
  PlayerStatsSheet.getRange(2, 3, PlayerStatsSheet.getLastRow() - 1, 6).setValues(playerlistarr);
}