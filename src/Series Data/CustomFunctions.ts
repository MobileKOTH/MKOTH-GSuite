/**
* 
* @param {Series} series
* @returns {Number} Total games of the series
*/
function CalculateSeriesEloRating(series)
{
    //score1 = score of player 1, score 2 = score of player 2
    //s1 = 1 if player 1 wins, s1 = 0 if player 2 wins, s1 = 0.5 if draw
    var score1 = series.player1.GetELO().value;
    var score2 = series.player2.GetELO().value;
    var s1 = (series.GetWinner() == series.player1) ? 1 : 0;
    var k = 40;
    var r1 = Math.pow(10, score1 / 400)
    var r2 = Math.pow(10, score2 / 400)
    var s2 = Math.abs(s1 - 1)
    var final = [score1 + k * (s1 - (r1 / (r1 + r2))), score2 + k * (s2 - (r2 / (r1 + r2)))]
    series.player1.SetELO(final[0], (series.player1wins + series.player2wins + series.draws));
    series.player2.SetELO(final[1], (series.player1wins + series.player2wins + series.draws));
}

/**
* 
* @param {Series} series 
*/
function CalculateGamesEloRating(series)
{
    //score1 = score of player 1, score 2 = score of player 2
    //s1 = 1 if player 1 wins, s1 = 0 if player 2 wins, s1 = 0.5 if draw
    var score1 = series.player1.GetELO().value;
    var score2 = series.player2.GetELO().value;
    for (var g = 0; g < series.player1wins; g++)
    {
        var s1 = 1;
        proccess();
    }
    for (var g = 0; g < series.player2wins; g++)
    {
        var s1 = 0;
        proccess();
    }
    for (var g = 0; g < series.draws; g++)
    {
        var s1 = 0.5;
        proccess();
    }

    function proccess()
    {
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