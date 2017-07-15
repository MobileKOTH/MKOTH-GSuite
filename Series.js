//Series ENUMS
var SeriesType = 
{
  RANKED : "Ranked",
  KNIGHT : "Knight",
  KING : "King",
  POINT : "Point"
}

var invalidReason = "";

function Series(date, type, player1, player2, player1wins, player2wins, draws)
{
  this.date = date;
  this.type = type;
  this.player1 = new Player(player1);
  this.player2 = new Player(player2);
  this.player1.LoadPlayerData();
  this.player2.LoadPlayerData();
  this.player1wins = player1wins;
  this.player2wins = player2wins;
  this.draws = draws;

  this.ReloadPlayers = function ()
  {
    this.player1.LoadPlayerData();
    this.player2.LoadPlayerData();
  }

  /**
  * Get the Winner player of the series
  * @method
  * @returns {Player} the player object
  */
  this.GetWinner = function ()
  {
    if (this.player1wins > this.player2wins)
    {
      return this.player1;
    }
    else
    {
      return this.player2;
    }
  }

  this.GetLoser = function ()
  {
    if (this.player1wins > this.player2wins)
    {
      return this.player2;
    }
    else
    {
      return this.player1;
    }
  }

  //  this.totalgames = this.GetTotalGames();
  //  
  //  this.GetTotalGames = function()
  //  {
  //    //Best of 5 for king and knight series
  //    if (type == kingSeries || type == knightSeries)
  //    {
  //      return 5; 
  //    }
  //    //Best of 5 for ranked between noble man
  //    if (type == rankSeries && (player1.class == "Nobleman"))
  //    {
  //      return 5;
  //    }
  //    if(type == rankSeries && (player1.class != "Nobleman"))
  //    {
  //      return 3;
  //    }
  //    if(type == pointSeries)
  //    {
  //      return 3;
  //    }
  //  }

  this.Submit = function ()
  {
    HistorySheet.appendRow([this.date, this.type, this.player1.name, this.player2.name, this.player1wins, this.player2wins, this.draws]);
  }

  this.UpdatePlayers = function ()
  {
    this.player1.LoadPlayerData();
    this.player2.LoadPlayerData();

    this.player1.wins = this.player1.wins + this.player1wins;
    this.player2.wins = this.player2.wins + this.player2wins;
    this.player1.draws = this.player1.draws + this.draws;
    this.player2.draws = this.player2.draws + this.draws;
    this.player1.loss = this.player1.loss + this.player2wins;
    this.player2.loss = this.player2.loss + this.player1wins;

    this.player1.points = this.player1.points - this.GetCostPoint();
    this.GetWinner().points = this.GetWinner().points + this.GetRewardPoints();

    this.player1.Update();
    this.player2.Update();
  }

  this.isValid = function ()
  {
    var playerlist = GetPlayerlistCache();
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
    for (i = 0; i < playerlist.length; i++)
    {
      if (this.player1.name.toLowerCase() == playerlist[i].name.toLowerCase())
      {
        isvalidplayer1 = true;
        player1 = playerlist[i];
      }
      if ((this.player2.name.toLowerCase() == playerlist[i].name.toLowerCase()))
      {
        isvalidplayer2 = true;
        player2 = playerlist[i];
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
      if (player1.rank < player2.rank)
      {
        isvalidplayer1 = false;
        invalidReason = "Player 1 rank is higher than player 2";
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
        return 10;
      }
    }

    if (this.type == SeriesType.KNIGHT)
    {
      if (this.player2.isKnight == true && this.GetWinner() == this.player2)
      {
        return 5;
      }
    }

    if (this.type == SeriesType.RANKED)
    {
      if (this.GetLoser().class == PlayerClass.NOBLEMAN)
      {
        return 10;
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
      return 1;
    }

    return 0;
  }

  this.GetCostPoint = function ()
  {
    // if (this.type == SeriesType.KING && this.player1.rank > 10)
    // {
    //   return 30;
    // }
    if (this.type == SeriesType.KING)
    {
      return 15;
    }
    if (this.type == SeriesType.KNIGHT)
    {
      return 18;
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

function GetMatchListFromSheet(Matchsheet)
{
  try
  {
    Matchsheet.sort(1);
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
