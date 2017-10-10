/**
 * @customfunction
 */
var StatsType =
    {
        SERIES: 0,
        GAMES: 1,
        WIN: "W",
        LOSS: "L"
    }

// -------------------------------- Player Listing -------------------------------- 

/**
 * Get the list of player names
 * @return {String[]}
 * @customfunction
 */
function GetPlayerNames()
{
    var names = ["Player Name"];
    for (var key in PlayerList)
    {
        if (PlayerList.hasOwnProperty(key))
        {
            var element = PlayerList[key];
            names.push(element.name);
        }
    }
    return names;
}

/**
 * Get the list of player status
 * @return {String[]}
 * @customfunction
 */
function GetPlayerStatus()
{
    var remarks = ["Remarks"];
    for (var key in PlayerList)
    {
        if (PlayerList.hasOwnProperty(key))
        {
            var element = PlayerList[key];
            if (element.isRemoved)
            {
                remarks.push(PlayerStatus.REMOVED);
            }
            else if (element.isHoliday)
            {
                remarks.push(PlayerStatus.HOLIDAY);
            }
            else
            {
                remarks.push(PlayerStatus.ACTIVE);
            }
        }
    }
    return remarks;
}

// -------------------------------- Advanced Stats -------------------------------- 

/**
 * @return {Number[]}
 * @customfunction
 */
function GetSeriesStats(seriestype, winloss)
{
    var serieslist = GetSeriesList();
    var values = [winloss];
    for (var key in PlayerList)
    {
        if (PlayerList.hasOwnProperty(key))
        {
            var element = PlayerList[key].name;
            var count = 0;
            for (var key1 in serieslist)
            {
                if (serieslist.hasOwnProperty(key1))
                {
                    var series = serieslist[key1];
                    if (seriestype == series.type)
                    {
                        if (series.GetWinner().name == element && winloss == StatsType.WIN)
                        {
                            count++;
                        }
                        else if (series.GetLoser().name == element && winloss == StatsType.LOSS)
                        {
                            count++;
                        }
                    }
                    else if (seriestype == "All")
                    {
                        if (series.GetWinner().name == element && winloss == StatsType.WIN)
                        {
                            count++;
                        }
                        else if (series.GetLoser().name == element && winloss == StatsType.LOSS)
                        {
                            count++;
                        }
                    }
                }
            }
            values.push(count);
        }
    }
    return values;
}


// -------------------------------- ELO -------------------------------- 
/**
 * @return {Number[]}
 * @customfunction
 */
function GetSeriesELO(seriestype)
{
    var serieslist = GetSeriesList();
    var values = ["Ranked"]
    for (var key in serieslist)
    {
        if (serieslist.hasOwnProperty(key))
        {
            var element = serieslist[key];
            if (seriestype == SeriesType.RANKED)
            {
                if (element.type != SeriesType.POINT)
                {
                    CalculateSeriesEloRating(element);
                }
            }
            else if (seriestype == "All")
            {
                CalculateSeriesEloRating(element);
            }
        }
    }
    for (var key in PlayerList)
    {
        if (PlayerList.hasOwnProperty(key))
        {
            var element = PlayerList[key];
            values.push(element.GetELO());
        }
    }
    return values;
}

/**
 * @return {Number[]}
 * @customfunction
 */
function GetGamesELO(seriestype)
{
    var serieslist = GetSeriesList();
    var values = ["Ranked"]
    for (var key in serieslist)
    {
        if (serieslist.hasOwnProperty(key))
        {
            var element = serieslist[key];
            if (seriestype == SeriesType.RANKED)
            {
                if (element.type != SeriesType.POINT)
                {
                    CalculateGamesEloRating(element);
                }
            }
            else if (seriestype == "All")
            {
                CalculateGamesEloRating(element);
            }
        }
    }
    for (var key in PlayerList)
    {
        if (PlayerList.hasOwnProperty(key))
        {
            var element = PlayerList[key];
            values.push(element.GetELO());
        }
    }
    return values;
}

function GetLeaderboardRankedSeriesELO()
{
    var serieslist = GetSeriesList();
    var values = ["Series ELO"]
    for (var key in serieslist)
    {
        if (serieslist.hasOwnProperty(key))
        {
            var element = serieslist[key];
            if (element.type != SeriesType.POINT)
            {
                CalculateSeriesEloRating(element);
            }
        }
    }
    for (var key in RankList.list)
    {
        if (RankList.list.hasOwnProperty(key))
        {
            var rank = RankList.list[key];
            values.push(rank.player.GetELO());
        }
    }
    return values;
}

/**
 * 
 * @param {Series} series 
 */
function CalculateSeriesEloRating(series)
{
    //score1 = score of player 1, score 2 = score of player 2
    //s1 = 1 if player 1 wins, s1 = 0 if player 2 wins, s1 = 0.5 if draw
    var score1 = series.player1.GetELO();
    var score2 = series.player2.GetELO();
    var s1 = (series.GetWinner() == series.player1) ? 1 : 0;
    var k = 40;
    var r1 = Math.pow(10, score1 / 400)
    var r2 = Math.pow(10, score2 / 400)
    var s2 = Math.abs(s1 - 1)
    var final = [score1 + k * (s1 - (r1 / (r1 + r2))), score2 + k * (s2 - (r2 / (r1 + r2)))]
    series.player1.SetELO(final[0]);
    series.player2.SetELO(final[1]);
}

/**
 * 
 * @param {Series} series 
 */
function CalculateGamesEloRating(series)
{
    //score1 = score of player 1, score 2 = score of player 2
    //s1 = 1 if player 1 wins, s1 = 0 if player 2 wins, s1 = 0.5 if draw
    var score1 = series.player1.GetELO();
    var score2 = series.player2.GetELO();
    for (var g = 0; g < series.player1wins; g++)
    {
        var s1 = 1;
        var k = 40;
        var r1 = Math.pow(10, score1 / 400)
        var r2 = Math.pow(10, score2 / 400)
        var s2 = Math.abs(s1 - 1)
        var final = [score1 + k * (s1 - (r1 / (r1 + r2))), score2 + k * (s2 - (r2 / (r1 + r2)))]
        score1 = final[0];
        score2 = final[1];
        series.player1.SetELO(final[0]);
        series.player2.SetELO(final[1]);
    }
    for (var g = 0; g < series.player2wins; g++)
    {
        var s1 = 0;
        var k = 40;
        var r1 = Math.pow(10, score1 / 400)
        var r2 = Math.pow(10, score2 / 400)
        var s2 = Math.abs(s1 - 1)
        var final = [score1 + k * (s1 - (r1 / (r1 + r2))), score2 + k * (s2 - (r2 / (r1 + r2)))]
        score1 = final[0];
        score2 = final[1];
        series.player1.SetELO(final[0]);
        series.player2.SetELO(final[1]);
    }
    for (var g = 0; g < series.draws; g++)
    {
        var s1 = 0.5;
        var k = 40;
        var r1 = Math.pow(10, score1 / 400)
        var r2 = Math.pow(10, score2 / 400)
        var s2 = Math.abs(s1 - 1)
        var final = [score1 + k * (s1 - (r1 / (r1 + r2))), score2 + k * (s2 - (r2 / (r1 + r2)))]
        score1 = final[0];
        score2 = final[1];
        series.player1.SetELO(final[0]);
        series.player2.SetELO(final[1]);
    }
}

// -------------------------------- Tools -------------------------------- 
var Tools =
    {
        Arrayify: function (object)
        {
            var list = []
            for (var key in object)
            {
                var element = object[key];
                list.push(element);
            }
            return list;
        }
    };