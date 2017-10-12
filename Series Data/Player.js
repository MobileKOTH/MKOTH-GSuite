/** Player class constants */
var PlayerClass =
  {
    KING: "King",
    NOBLEMAN: "Nobleman",
    SQUIRE: "Squire",
    VASSAL: "Vassal",
    PEASANT: "Peasant",
    KNIGHT: " (Knight)"
  }

/** The max cap rank possition of a class */
var ClassRank =
  {
    KING: 1,
    NOBLEMAN: 10,
    SQUIRE: 30,
    VASSAL: 50,

    /**
     * Parse a player class name to return its rank cap
     * @param {String} playerclass
     * @returns {Number}
     */
    ParsePlayerClass: function (playerclass)
    {
      switch (playerclass)
      {
        case PlayerClass.KING:
          return ClassRank.KING;
          break;

        case PlayerClass.NOBLEMAN:
          return ClassRank.NOBLEMAN;
          break;

        case PlayerClass.SQUIRE:
          return ClassRank.SQUIRE;
          break;

        case PlayerClass.VASSAL:
          return ClassRank.VASSAL;
          break;

        case PlayerClass.PEASANT:
          return ClassRank.PEASANT;
          break;
      }
    }
  }

var PlayerStatus =
  {
    ACTIVE: "Active",
    HOLIDAY: "Holiday",
    REMOVED: "Removed"
  }

var PlayerList = GetPlayerList();

/**
 * Represents a player.
 * @param {String} name the name of the Player
 */
function Player(name)
{
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

  this.oldrank = 0;
  this.oldpoints = 0;

  var elo = { value: 1200, games: 0 };

  /** Adds the Player to MKOTH */
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
    PlayerStatsSheet.appendRow([this.name, this.joinDate, this.class, this.wins, this.loss, this.draws, this.GetWinrate(), this.GetGamesCount(), 0, null, null]);
    RankingSheet.appendRow([this.rank, this.name, this.class, this.points]);
    PlayerCodeSheet.appendRow([this.name]);

    ManagementLogSheet.appendRow([new Date(), "Add Player", JSON.stringify(this)]);
    return true;
  }

  this.Remove = function ()
  {
    this.isRemoved = true;
    ManagementLogSheet.appendRow([new Date(), "Remove Player", JSON.stringify(this)]);
    this.rank = 0;
    for (row = 1; row < PlayerStatsSheet.getLastRow(); row++)
    {
      if (PlayerStatsSheet.getRange(row, 1).getValue() == this.name)
      {
        PlayerStatsSheet.getRange(row, 11).setBackground("#ff0000");
        PlayerStatsSheet.getRange(row, 11).setValue(PlayerStatus.REMOVED);
        break;
      }
    }
    RankList.PurgePlayer(this.name);
    UpdateRankList();
    return true;
  }

  this.GetWinrate = function ()
  {
    return 100 / (this.wins + this.loss) * this.wins;
  }

  this.GetGamesCount = function ()
  {
    return this.wins + this.loss + this.draws;
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
  }

  this.PromoteKnight = function ()
  {
    this.isKnight = true;
    UpdatePlayerList();
    UpdateRankList();
  }

  this.GetELO = function ()
  {
    return elo;
  }

  this.SetELO = function (value, games)
  {
    elo.value = value;
    elo.games = (!isNaN(games)) ? (elo.games + games) : (elo.games + 1);
  }
}

/**
 * Fetch a player object reference from playerlist
 * @param {String} playername Player name to fetch
 * @returns {Player} player object reference of the name
 */
Player.Fetch = function (playername)
{
  for (var key in PlayerList)
  {
    if (PlayerList.hasOwnProperty(key))
    {
      var element = PlayerList[key];
      if (element.name == playername)
      {
        return element;
      }
    }
  }
  return undefined;
}

/**
 * 
 * @param {String} name
 * @returns {Boolean}
 */
function checkPlayerRepeat(name)
{
  for (i = 0; i < PlayerList.length; i++)
  {
    if (PlayerList[i].name.toLowerCase() == name.toLowerCase())
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
      if (playerDB[i][10] == PlayerStatus.REMOVED)
      {
        playerlist[i].isRemoved = true;
        playerlist[i].rank = 0;
      }
      if (playerDB[i][10] == PlayerStatus.HOLIDAY)
      {
        playerlist[i].isHoliday = true;
        playerlist[i].rank = ClassRank.ParsePlayerClass(playerlist[i].class);
      }
      for (j = 0; j < playerRankDB.length; j++)
      {
        if (playerRankDB[j][1] == playerlist[i].name)
        {
          playerlist[i].rank = playerRankDB[j][0];
          playerlist[i].points = playerRankDB[j][3];
          playerlist[i].oldrank = playerRankDB[j][0];
          playerlist[i].oldpoints = playerRankDB[j][3];
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

function UpdatePlayerList()
{
  var playerlistarr = [];
  for (uu = 0; uu < PlayerList.length; uu++)
  {
    var classStr = (PlayerList[uu].isKnight) ? PlayerList[uu].class + " (Knight)" : PlayerList[uu].class;
    playerlistarr.push([classStr, PlayerList[uu].wins, PlayerList[uu].loss, PlayerList[uu].draws, PlayerList[uu].GetWinrate(), PlayerList[uu].GetGamesCount()]);
  }
  PlayerStatsSheet.getRange(2, 3, PlayerStatsSheet.getLastRow() - 1, 6).setValues(playerlistarr);
}