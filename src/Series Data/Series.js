/**
 * Series ENUMS
 * @customfunction
 */
var SeriesType =
  {
    RANKED: "Ranked",
    KNIGHT: "Knight",
    KING: "King",
    POINT: "Point"
  }

var invalidReason = "";

/**
 * Represents a series
 * @param {Date} date 
 * @param {String} type 
 * @param {String} player1 
 * @param {String} player2
 * @param {Number} player1wins 
 * @param {Number} player2wins 
 * @param {Number} draws 
 */
function Series(date, type, player1, player2, player1wins, player2wins, draws)
{
  this.date = date;
  this.type = type;
  this.player1 = Player.Fetch(player1);
  this.player2 = Player.Fetch(player2);
  this.player1wins = player1wins;
  this.player2wins = player2wins;
  this.draws = draws;

  /**
  * Get the Winner player of the series
  * @returns {Player} the player object
  */
  this.GetWinner = function ()
  {
    if (this.player1wins < this.player2wins)
    {
      return this.player2;
    }
    else
    {
      return this.player1;
    }
  }

  this.GetLoser = function ()
  {
    if (this.player1wins < this.player2wins)
    {
      return this.player1;
    }
    else
    {
      return this.player2;
    }
  }

  this.Submit = function ()
  {
    ValidationSheet.deleteRows(2, 1);
    HistorySheet.appendRow([this.date, this.type, this.player1.name, this.player2.name, this.player1wins, this.player2wins, this.draws]);
  }

  this.UpdatePlayers = function ()
  {
    this.player1.ComeBackHoliday();
    this.player2.ComeBackHoliday();

    this.player1.wins = this.player1.wins + this.player1wins;
    this.player2.wins = this.player2.wins + this.player2wins;
    this.player1.draws = this.player1.draws + this.draws;
    this.player2.draws = this.player2.draws + this.draws;
    this.player1.loss = this.player1.loss + this.player2wins;
    this.player2.loss = this.player2.loss + this.player1wins;

    this.player1.points = this.player1.points - this.GetCostPoint();
    this.GetWinner().points = this.GetWinner().points + this.GetRewardPoints();

    if (this.type == SeriesType.KING)
    {
      this.player1.mip = this.GetWinner() == this.player1 ? 0 : (this.player1.mip - 5) < 0 ? 0 : (this.player1.mip - 5);
      this.player2.mip = 0;
    }

    if (this.player1.class != PlayerClass.KING && this.player1.class != PlayerClass.NOBLEMAN)
    {
      this.player1.mip = 0;
    }
    else
    {
      if (this.type != SeriesType.POINT && this.GetWinner() == this.player1)
      {
        this.player1.mip = 0;
      }
      else if (this.type != SeriesType.POINT)
      {
        this.player1.mip = (this.player1.mip - 2) < 0 ? 0 : (this.player1.mip - 2);
      }
    }

    if (this.player2.class != PlayerClass.KING && this.player2.class != PlayerClass.NOBLEMAN)
    {
      this.player2.mip = 0;
    }
    else
    {
      if (this.type != SeriesType.POINT && this.GetWinner() == this.player2)
      {
        this.player2.mip = 0;
      }
      else if (this.type != SeriesType.POINT)
      {
        this.player2.mip = (this.player2.mip - 2) < 0 ? 0 : (this.player2.mip - 2);
      }
    }
  }

  this.isValid = function ()
  {
    var player1 = new Player("chanllenger");
    var player2 = new Player("defender");
    var isvalidplayer1 = false;
    var isvalidplayer2 = false;

    if (this.player1.name.toLowerCase() == this.player2.name.toLowerCase())
    {
      invalidReason = "Both players are the same";
      ValidationSheet.getRange(2, 9).setValue(invalidReason);
      ValidationSheet.getRange(2, 9).setBackground("#ff0000");
      return false;
    }
    for (i = 0; i < PlayerList.length; i++)
    {
      if (this.player1.name.toLowerCase() == PlayerList[i].name.toLowerCase())
      {
        isvalidplayer1 = true;
        player1 = PlayerList[i];
      }
      if ((this.player2.name.toLowerCase() == PlayerList[i].name.toLowerCase()))
      {
        isvalidplayer2 = true;
        player2 = PlayerList[i];
      }
      if (player1.isRemoved || player2.isRemoved)
      {
        invalidReason = "Contains removed player";
        ValidationSheet.getRange(2, 9).setValue(invalidReason);
        ValidationSheet.getRange(2, 9).setBackground("#ff0000");
        return false;
      }
    }
    invalidReason = "Unregistered Players";
    if (this.type == SeriesType.KING)
    {
      if (player1.class != PlayerClass.NOBLEMAN)
      {
        isvalidplayer1 = false;
        invalidReason = "Player 1 is not a Nobleman";
      }
      if (player2.class != PlayerClass.KING)
      {
        isvalidplayer2 = false;
        invalidReason = "Player 2 is not a King";
      }
    }
    if (this.type == SeriesType.RANKED)
    {
      if (player2.rank == 1)
      {
        isvalidplayer2 = false;
        invalidReason = "King cannot play ranked series";
      }
      if (player1.rank < player2.rank)
      {
        isvalidplayer1 = false;
        invalidReason = "Player 1 rank is higher than player 2";
      }
      if (player1.class == PlayerClass.PEASANT && player2.class == PlayerClass.SQUIRE)
      {
        isvalidplayer1 = false;
        invalidReason = "Player 1 cannot jump more than 1 class";
      }
      if (player2.class == PlayerClass.NOBLEMAN)
      {
        if (player1.class != PlayerClass.NOBLEMAN)
        {
          isvalidplayer1 = false;
          invalidReason = "Player 1 isnt Nobleman for Nobleman Ranked";
        }
      }
    }
    if (this.type == SeriesType.KNIGHT)
    {
      if (player2.isKnight == false)
      {
        isvalidplayer2 = false;
        invalidReason = "Player 2 is not a knight";
      }
    }

    ValidationSheet.getRange(2, 9).setValue(invalidReason);
    ValidationSheet.getRange(2, 9).setBackground("#ff0000");
    return (isvalidplayer1 && isvalidplayer2);
  }

  this.GetRewardPoints = function ()
  {
    if (this.type == SeriesType.KING)
    {
      if (this.GetWinner().class == PlayerClass.KING)
      {
        return 7;
      }
      else
      {
        return 7;
      }
    }

    if (this.type == SeriesType.KNIGHT)
    {
      if (this.player2.isKnight == true && this.GetWinner() == this.player2)
      {
        return 5;
      }
      if (this.player1.class == PlayerClass.NOBLEMAN || this.player1.KING == PlayerClass.NOBLEMAN)
      {
        return 7;
      }
    }

    if (this.type == SeriesType.RANKED)
    {
      if (this.GetLoser().class == PlayerClass.NOBLEMAN)
      {
        return 7;
      }
      if (this.GetLoser().class == PlayerClass.SQUIRE)
      {
        return 5;
      }
      if (this.GetLoser().class == PlayerClass.VASSAL)
      {
        return 3;
      }
      if (this.GetLoser().class == PlayerClass.PEASANT)
      {
        return 2;
      }
    }
    if (this.type == SeriesType.POINT)
    {
      return 2;
    }

    return 0;
  }

  this.GetCostPoint = function ()
  {
    if (this.type == SeriesType.KING)
    {
      return 15;
    }
    if (this.type == SeriesType.KNIGHT)
    {
      if (this.player1.class == PlayerClass.NOBLEMAN || this.player1.class == PlayerClass.KING)
      {
        return 0;
      }
      else
      {
        return 18;
      }
    }
    if (this.type == SeriesType.RANKED)
    {
      if (this.player1.class == PlayerClass.VASSAL && this.player2.class == PlayerClass.SQUIRE)
      {
        return 12;
      }
      if (this.player1.class == PlayerClass.PEASANT && this.player2.class == PlayerClass.VASSAL)
      {
        return 6;
      }
    }
    return 0;
  }
}

function GetSeriesList()
{
  var serieslist = GetMatchListFromSheet(HistorySheet);
  return serieslist;
}

function GetValidateList()
{
  var serieslist = GetMatchListFromSheet(ValidationSheet);
  return serieslist;
}

/**
 * 
 * @param {GoogleAppsScript.Spreadsheet.Sheet} Matchsheet
 * @returns {Series[]}
 */
function GetMatchListFromSheet(Matchsheet)
{
  try
  {
    var serieslist = [];
    var seriesDB = Matchsheet.getRange(2, 1, Matchsheet.getLastRow() - 1, 7).getValues();
    for (s = 0; s < seriesDB.length; s++)
    {
      var series = seriesDB[s];
      serieslist.push(new Series(series[0], series[1], series[2], series[3], series[4], series[5], series[6]));
    }
  }
  catch (err)
  {
    RunError(err);
  }
  return serieslist;
}

/**
 * Check the pending series list in validation sheet and state if there is any invalid series
 * @param {Series[]} uncheckSeriesList 
 */
function CheckSeriesList(uncheckSeriesList)
{
  for (k = 0; k < uncheckSeriesList.length; k++)
  {
    if (uncheckSeriesList[k].isValid() == false)
    {
      ValidationSheet.getRange(k + 2, 9).setValue(invalidReason);
      ValidationSheet.getRange(k + 2, 9).setBackground("#ff0000");
      return false;
    }
  }
  return true;
}
