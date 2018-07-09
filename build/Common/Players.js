var MKOTHGSuite;
(function (MKOTHGSuite) {
    var ActionResult = MKOTHGSuite.Actions.ActionResult;
    var PlayerClassName;
    (function (PlayerClassName) {
        PlayerClassName["King"] = "King";
        PlayerClassName["Nobleman"] = "Nobleman";
        PlayerClassName["Squire"] = "Squire";
        PlayerClassName["Vassal"] = "Vassal";
        PlayerClassName["Peasant"] = "Peasant";
    })(PlayerClassName = MKOTHGSuite.PlayerClassName || (MKOTHGSuite.PlayerClassName = {}));
    /** The max cap rank possition of a class */
    var PlayerClassBaseRankCap;
    (function (PlayerClassBaseRankCap) {
        PlayerClassBaseRankCap[PlayerClassBaseRankCap["King"] = 1] = "King";
        PlayerClassBaseRankCap[PlayerClassBaseRankCap["Nobleman"] = 10] = "Nobleman";
        PlayerClassBaseRankCap[PlayerClassBaseRankCap["Squire"] = 30] = "Squire";
        PlayerClassBaseRankCap[PlayerClassBaseRankCap["Vassal"] = 50] = "Vassal";
    })(PlayerClassBaseRankCap = MKOTHGSuite.PlayerClassBaseRankCap || (MKOTHGSuite.PlayerClassBaseRankCap = {}));
    var PlayerStatus;
    (function (PlayerStatus) {
        PlayerStatus["Active"] = "Active";
        PlayerStatus["Holiday"] = "Holiday";
        PlayerStatus["Removed"] = "Removed";
    })(PlayerStatus = MKOTHGSuite.PlayerStatus || (MKOTHGSuite.PlayerStatus = {}));
    var HolidayModeMIP = /** @class */ (function () {
        function HolidayModeMIP() {
        }
        Object.defineProperty(HolidayModeMIP, "holidayMode", {
            get: function () {
                var iterations = RankList.GetLastPosition() > HolidayModeMIP.RankSafeCap ? 0 : HolidayModeMIP.RankSafeCap - RankList.GetLastPosition();
                var increment = Math.floor((Math.pow((((1 + Math.sqrt(5)) / 2)), iterations) - Math.pow((((1 - Math.sqrt(5)) / 2)), iterations)) / Math.sqrt(5));
                return this.BaseDays + increment;
            },
            enumerable: true,
            configurable: true
        });
        HolidayModeMIP.BaseDays = 30;
        HolidayModeMIP.RankSafeCap = 70;
        HolidayModeMIP.CommonDemotion = 7;
        HolidayModeMIP.HolidayMode = HolidayModeMIP.holidayMode;
        HolidayModeMIP.EliteDemotion = HolidayModeMIP.BaseDays;
        return HolidayModeMIP;
    }());
    MKOTHGSuite.HolidayModeMIP = HolidayModeMIP;
    var PlayerEnitiy = MKOTHGSuite.Models.PlayerEntity;
    var Players = /** @class */ (function () {
        function Players() {
        }
        Players.add = function (playerName, discordId) {
            if (this.playerList.every(function (x) { return x.name != playerName; })) {
                var player = new PlayerEnitiy();
                player.name = playerName;
                player.discordId = discordId;
                player.rank = this.playerList.filter(function (x) { return x.status == PlayerStatus.Active; }).length + 1;
                this.playerList.push();
                return new ActionResult();
            }
            else {
                return new ActionResult(false, "Player already exist: " + playerName);
            }
        };
        Players.update = function () {
            this.entitySet.update(this.playerList);
        };
        Players.entitySet = MKOTHGSuite.EntitySets.GetPlayerEntitySet();
        Players.playerList = Players.entitySet.load();
        return Players;
    }());
    MKOTHGSuite.Players = Players;
})(MKOTHGSuite || (MKOTHGSuite = {}));
