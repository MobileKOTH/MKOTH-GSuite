var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var MKOTHGSuite;
(function (MKOTHGSuite) {
    var Actions;
    (function (Actions) {
        var ActionsType;
        (function (ActionsType) {
            ActionsType[ActionsType["AddPlayer"] = 0] = "AddPlayer";
        })(ActionsType = Actions.ActionsType || (Actions.ActionsType = {}));
        var ActionResult = /** @class */ (function () {
            function ActionResult(success, message) {
                if (success === void 0) { success = true; }
                if (message === void 0) { message = "Success!"; }
                this.success = success;
                this.message = message;
            }
            return ActionResult;
        }());
        Actions.ActionResult = ActionResult;
        var ActionBase = /** @class */ (function () {
            function ActionBase() {
                this.date = new Date();
            }
            ActionBase.prototype.parse = function (json) {
                var action = JSON.parse(json);
                return action;
            };
            ActionBase.prototype.stringify = function () {
                return JSON.stringify(this);
            };
            return ActionBase;
        }());
        var AddPlayerAction = /** @class */ (function (_super) {
            __extends(AddPlayerAction, _super);
            function AddPlayerAction() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.date = new Date();
                _this.type = ActionsType.AddPlayer;
                _this.joinDate = new Date();
                return _this;
            }
            AddPlayerAction.prototype.invoke = function () {
                return MKOTHGSuite.Players.add(this.playerName, this.discordId, this.joinDate);
            };
            return AddPlayerAction;
        }(ActionBase));
        Actions.AddPlayerAction = AddPlayerAction;
        function RunActions(actions) {
            actions.forEach(function (x) {
                var result = x.invoke();
                if (!result.success) {
                    throw new Error("Failed executing: " + x.stringify() + "\n" + result.message);
                }
            });
            MKOTHGSuite.Players.update();
        }
        Actions.RunActions = RunActions;
    })(Actions = MKOTHGSuite.Actions || (MKOTHGSuite.Actions = {}));
})(MKOTHGSuite || (MKOTHGSuite = {}));
var MKOTHGSuite;
(function (MKOTHGSuite) {
    var ActionResult = MKOTHGSuite.Actions.ActionResult;
    var PlayerEntity = MKOTHGSuite.Models.PlayerEntity;
    var PlayerStatus;
    (function (PlayerStatus) {
        PlayerStatus["Active"] = "Active";
        PlayerStatus["Holiday"] = "Holiday";
        PlayerStatus["Removed"] = "Removed";
    })(PlayerStatus = MKOTHGSuite.PlayerStatus || (MKOTHGSuite.PlayerStatus = {}));
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
    var PlayerClassELORankCap = /** @class */ (function () {
        function PlayerClassELORankCap() {
        }
        return PlayerClassELORankCap;
    }());
    var PlayerELOTiers = /** @class */ (function () {
        function PlayerELOTiers() {
        }
        return PlayerELOTiers;
    }());
    var HolidayModeMIP = /** @class */ (function () {
        function HolidayModeMIP() {
        }
        Object.defineProperty(HolidayModeMIP, "holidayMode", {
            get: function () {
                var iterations = Players.lastActiveRank > HolidayModeMIP.RankSafeCap ? 0 : HolidayModeMIP.RankSafeCap - Players.lastActiveRank;
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
    var Players = /** @class */ (function () {
        function Players() {
        }
        Object.defineProperty(Players, "InternalPlayerList", {
            get: function () {
                if (!this._internalList) {
                    this._internalList = MKOTHGSuite.EntitySets.GetInternalPlayerEntitySet().load();
                }
                return this._internalList;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Players, "ExternalPlayerList", {
            get: function () {
                if (!this._externalList) {
                    this._externalList = MKOTHGSuite.EntitySets.GetExternalPlayerEntitySet().load();
                }
                return this._externalList;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Players, "lastActiveRank", {
            get: function () {
                return this.InternalPlayerList
                    .filter(function (x) { return x.status == PlayerStatus.Active; })
                    .length + 1;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Players, "classELORankCap", {
            get: function () {
                throw new Error("Not implemented");
            },
            enumerable: true,
            configurable: true
        });
        Players.add = function (playerName, discordId, joinDate) {
            if (joinDate === void 0) { joinDate = new Date(); }
            if (playerName == "") {
                return new ActionResult(false, "Name is empty.");
            }
            if (this.InternalPlayerList.every(function (x) { return x.name.toLowerCase() != playerName.toLowerCase(); })) {
                var player = new PlayerEntity({
                    name: playerName,
                    rank: this.lastActiveRank,
                    joinDate: joinDate,
                    discordId: discordId
                });
                this.InternalPlayerList.push(player);
                return new ActionResult();
            }
            else {
                return new ActionResult(false, "Player already exist: " + playerName);
            }
        };
        Players.remove = function (id) {
            var player = this.InternalPlayerList.find(function (x) { return x.id == id; });
            if (player) {
                if (player.status == PlayerStatus.Removed) {
                    return new ActionResult(false, "Player already removed");
                }
                else {
                    this.removeToRank(player);
                    player.rank = 0;
                    player.status = PlayerStatus.Removed;
                    player.class = player.class == PlayerClassName.King || player.class == PlayerClassName.Nobleman ? PlayerClassName.Squire : player.class;
                    return new ActionResult();
                }
            }
            else {
                return new ActionResult(false, "Player not found: " + id);
            }
        };
        Players.reAdd = function (id) {
            var player = this.InternalPlayerList.find(function (x) { return x.id == id; });
            if (player) {
                if (player.status != PlayerStatus.Removed) {
                    return new ActionResult(false, "Player not removed");
                }
                var rankCap = this.classELORankCap[player.class];
                player.rank = rankCap;
                player.status = PlayerStatus.Active;
                this.insertToRank(player);
            }
            else {
                return new ActionResult(false, "Player not found: " + id);
            }
        };
        Players.removeToRank = function (player) {
            var affected = this.InternalPlayerList
                .filter(function (x) { return x.status == PlayerStatus.Active; })
                .filter(function (x) { return x.rank > player.rank; });
            affected.forEach(function (x) { return x.rank--; });
            return this.InternalPlayerList;
        };
        Players.insertToRank = function (player) {
            var affected = this.InternalPlayerList
                .filter(function (x) { return x.status == PlayerStatus.Active; })
                .filter(function (x) { return x.rank >= player.rank && x.id != player.id; });
            affected.forEach(function (x) { return x.rank++; });
            return this.InternalPlayerList;
        };
        Players.moveUpToRank = function (player, targetRank) {
            this.removeToRank(player);
            player.rank = targetRank;
            this.insertToRank(player);
            return this.InternalPlayerList;
        };
        Players.changePoints = function (id, pointChange) {
            var player = this.InternalPlayerList.find(function (x) { return x.id == id; });
            if (player) {
                player.points += pointChange;
                return new ActionResult();
            }
            else {
                return new ActionResult(false, "Player not found: " + id);
            }
        };
        Players.rename = function (id, newName) {
            var player = this.InternalPlayerList.find(function (x) { return x.id == id; });
            if (player) {
                player.name = newName;
                return new ActionResult();
            }
            else {
                return new ActionResult(false, "Player not found: " + id);
            }
        };
        Players.search = function (options) {
            var searchOption = MKOTHGSuite.Tools.getDefinedOptionKeyValue(options);
            var player = this.InternalPlayerList.find(function (x) { return x[searchOption.key] == searchOption.value; });
            return player;
        };
        Players.update = function () {
            return MKOTHGSuite.EntitySets.GetInternalPlayerEntitySet().update(this.InternalPlayerList);
        };
        Players.sync = function () {
            return MKOTHGSuite.EntitySets.GetExternalPlayerEntitySet().update(this.InternalPlayerList);
        };
        Players.revert = function () {
            return MKOTHGSuite.EntitySets.GetInternalPlayerEntitySet().update(this.ExternalPlayerList);
        };
        Players.test = function () {
            Logger.log("test");
        };
        return Players;
    }());
    MKOTHGSuite.Players = Players;
})(MKOTHGSuite || (MKOTHGSuite = {}));
var MKOTHGSuite;
(function (MKOTHGSuite) {
    var tools = /** @class */ (function () {
        function tools() {
        }
        /**
        * Turn object properties into a set of array
        */
        tools.prototype.arrayify = function (object) {
            var list = [];
            for (var key in object) {
                var element = object[key];
                list.push(element);
            }
            return list;
        };
        /**
        * Pad 0 to make a fixed length number
        */
        tools.prototype.numberPadding = function (number, length, z) {
            z = z || '0';
            var numberStr = number + '';
            return numberStr.length >= length ? numberStr : new Array(length - numberStr.length + 1).join(z) + numberStr;
        };
        tools.prototype.isMIPWarningPeriod = function (baseDays, mip) {
            var isOdd = (baseDays - mip) % 2 != 0;
            var lessThan7days = mip >= (baseDays - 7);
            var not5days = mip != (baseDays - 5);
            var moreThan0days = (baseDays - mip) > 0;
            return (isOdd && lessThan7days && not5days && moreThan0days);
        };
        tools.prototype.computeMD5Hash = function (content) {
            var digest = Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, content, Utilities.Charset.UTF_8);
            return getHash(digest);
            function getHash(numbers) {
                var output = "";
                numbers.forEach(function (element) {
                    output += (element < 0 ? element + 256 : element).toString(16);
                });
                return output;
            }
        };
        tools.prototype.getDefinedOptionKeyValue = function (options) {
            for (var key in options) {
                if (options.hasOwnProperty(key)) {
                    return { key: key, value: options[key] };
                }
            }
            return { key: "", value: null };
        };
        return tools;
    }());
    MKOTHGSuite.Tools = new tools();
})(MKOTHGSuite || (MKOTHGSuite = {}));
// https://tc39.github.io/ecma262/#sec-array.prototype.find
if (!Array.prototype.find) {
    Object.defineProperty(Array.prototype, 'find', {
        value: function (predicate) {
            // 1. Let O be ? ToObject(this value).
            if (this == null) {
                throw new TypeError('"this" is null or not defined');
            }
            var o = Object(this);
            // 2. Let len be ? ToLength(? Get(O, "length")).
            var len = o.length >>> 0;
            // 3. If IsCallable(predicate) is false, throw a TypeError exception.
            if (typeof predicate !== 'function') {
                throw new TypeError('predicate must be a function');
            }
            // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
            var thisArg = arguments[1];
            // 5. Let k be 0.
            var k = 0;
            // 6. Repeat, while k < len
            while (k < len) {
                // a. Let Pk be ! ToString(k).
                // b. Let kValue be ? Get(O, Pk).
                // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
                // d. If testResult is true, return kValue.
                var kValue = o[k];
                if (predicate.call(thisArg, kValue, k, o)) {
                    return kValue;
                }
                // e. Increase k by 1.
                k++;
            }
            // 7. Return undefined.
            return undefined;
        },
        configurable: true,
        writable: true
    });
}
var MKOTHGSuite;
(function (MKOTHGSuite) {
    var SeriesType;
    (function (SeriesType) {
        SeriesType["King"] = "King";
    })(SeriesType = MKOTHGSuite.SeriesType || (MKOTHGSuite.SeriesType = {}));
})(MKOTHGSuite || (MKOTHGSuite = {}));
var Discord;
(function (Discord) {
    var EmbedBuilder = /** @class */ (function () {
        function EmbedBuilder() {
        }
        EmbedBuilder.prototype.withTitle = function (input) {
            this.title = input;
            return this;
        };
        EmbedBuilder.prototype.withDescription = function (input) {
            this.description = input;
        };
        EmbedBuilder.prototype.addField = function (name, value, inline) {
            if (inline === void 0) { inline = true; }
            if (this.fields.length < 25) {
                this.fields.push(new EmbedFieldBuilder()
                    .withName(name)
                    .withValue(value)
                    .isWithInline(inline));
            }
            return this;
        };
        EmbedBuilder.prototype.toJSON = function () {
            return JSON.stringify(this);
        };
        return EmbedBuilder;
    }());
    Discord.EmbedBuilder = EmbedBuilder;
    var EmbedFieldBuilder = /** @class */ (function () {
        function EmbedFieldBuilder() {
        }
        EmbedFieldBuilder.prototype.withName = function (input) {
            this.name = input;
            return this;
        };
        EmbedFieldBuilder.prototype.withValue = function (input) {
            this.value = input;
            return this;
        };
        EmbedFieldBuilder.prototype.isWithInline = function (input) {
            this.inline = input;
            return this;
        };
        return EmbedFieldBuilder;
    }());
})(Discord || (Discord = {}));
var Discord;
(function (Discord) {
    var WebHook = /** @class */ (function () {
        function WebHook() {
        }
        WebHook.Send = function (url, content, embeds) {
            var response = UrlFetchApp.fetch(url);
        };
        return WebHook;
    }());
    Discord.WebHook = WebHook;
})(Discord || (Discord = {}));
var MKOTHGSuite;
(function (MKOTHGSuite) {
    var EntitySets;
    (function (EntitySets) {
        var EntitySet = EntitySystem.EntitySet;
        function GetInternalPlayerEntitySet() {
            return new EntitySet({
                spreadSheet: getInternalSpreadSheet(),
                tableName: "_playerTable"
            });
        }
        EntitySets.GetInternalPlayerEntitySet = GetInternalPlayerEntitySet;
        function GetExternalPlayerEntitySet() {
            return new EntitySet({
                spreadSheet: getExternalSpreadSheet(),
                tableName: "_playerTable"
            });
        }
        EntitySets.GetExternalPlayerEntitySet = GetExternalPlayerEntitySet;
        function GetInternalSeriesEntitySet() {
            return new EntitySet({
                spreadSheet: getInternalSpreadSheet(),
                tableName: "_seriesTable"
            });
        }
        EntitySets.GetInternalSeriesEntitySet = GetInternalSeriesEntitySet;
        function GetExternalSeriesEntitySet() {
            return new EntitySet({
                spreadSheet: getExternalSpreadSheet(),
                tableName: "_seriesTable"
            });
        }
        EntitySets.GetExternalSeriesEntitySet = GetExternalSeriesEntitySet;
    })(EntitySets = MKOTHGSuite.EntitySets || (MKOTHGSuite.EntitySets = {}));
})(MKOTHGSuite || (MKOTHGSuite = {}));
var EntitySystem;
(function (EntitySystem) {
    var EntitySet = /** @class */ (function () {
        function EntitySet(options) {
            this.spreadSheet = options.spreadSheet;
            this.tableName = options.tableName;
        }
        EntitySet.prototype.load = function () {
            return Loader.loadEntities(this.spreadSheet, this.tableName);
        };
        EntitySet.prototype.update = function (entities) {
            return Updater.updateEntities(this.spreadSheet, this.tableName, entities);
        };
        return EntitySet;
    }());
    EntitySystem.EntitySet = EntitySet;
    var Loader = /** @class */ (function () {
        function Loader() {
        }
        Loader.loadEntities = function (spreadSheet, tableName) {
            var tableSheet = spreadSheet.getSheetByName(tableName);
            var rows = tableSheet.getLastRow();
            var columns = tableSheet.getLastColumn();
            var range = tableSheet.getRange(1, 1, rows, columns);
            var values = range.getValues();
            var propertyNames = values.shift();
            var entities = new Array();
            for (var key in values) {
                if (values.hasOwnProperty(key)) {
                    var element = values[key];
                    var entity = Loader.loadEntity(propertyNames, element);
                    entities.push(entity);
                }
            }
            return entities;
        };
        Loader.loadEntity = function (propertyNames, row) {
            var entity = {};
            for (var propertyNameIndex = 0; propertyNameIndex < propertyNames.length; propertyNameIndex++) {
                entity[propertyNames[propertyNameIndex]] = row[propertyNameIndex];
            }
            return entity;
        };
        return Loader;
    }());
    var Updater = /** @class */ (function () {
        function Updater() {
        }
        Updater.updateEntities = function (spreadSheet, tableName, entities) {
            var tableSheet = spreadSheet.getSheetByName(tableName);
            var keys = Object.keys(entities[0]);
            var rows = entities.length + 1;
            var columns = keys.length;
            var range = tableSheet.getRange(1, 1, rows, columns);
            var values = [keys];
            for (var key in entities) {
                if (entities.hasOwnProperty(key)) {
                    var element = entities[key];
                    var rowValues = Updater.generateEntityRow(element);
                    values.push(rowValues);
                }
            }
            tableSheet.clearContents();
            return range.setValues(values);
        };
        Updater.generateEntityRow = function (entity) {
            var row = [];
            for (var key in entity) {
                if (entity.hasOwnProperty(key)) {
                    var element = entity[key];
                    row.push(element);
                }
            }
            return row;
        };
        return Updater;
    }());
})(EntitySystem || (EntitySystem = {}));
var MKOTHGSuite;
(function (MKOTHGSuite) {
    var Models;
    (function (Models) {
        var PlayerEntity = /** @class */ (function () {
            function PlayerEntity(options) {
                this.class = MKOTHGSuite.PlayerClassName.Peasant;
                this.isKnight = false;
                this.points = 0;
                this.winsAll = 0;
                this.lossAll = 0;
                this.drawsAll = 0;
                this.winsMain = 0;
                this.lossMain = 0;
                this.drawsMain = 0;
                this.elo = 1200;
                this.status = MKOTHGSuite.PlayerStatus.Active;
                this.id = MKOTHGSuite.Tools.computeMD5Hash(options.name + options.joinDate);
                this.name = options.name;
                this.rank = options.rank;
                this.joinDate = options.joinDate;
                this.discordId = options.discordId;
            }
            return PlayerEntity;
        }());
        Models.PlayerEntity = PlayerEntity;
        var PlayerKeyEntity = /** @class */ (function () {
            function PlayerKeyEntity() {
            }
            return PlayerKeyEntity;
        }());
        Models.PlayerKeyEntity = PlayerKeyEntity;
        var SeriesEntity = /** @class */ (function () {
            function SeriesEntity() {
            }
            return SeriesEntity;
        }());
        Models.SeriesEntity = SeriesEntity;
        var RawSeriesEntity = /** @class */ (function (_super) {
            __extends(RawSeriesEntity, _super);
            function RawSeriesEntity() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return RawSeriesEntity;
        }(SeriesEntity));
        Models.RawSeriesEntity = RawSeriesEntity;
    })(Models = MKOTHGSuite.Models || (MKOTHGSuite.Models = {}));
})(MKOTHGSuite || (MKOTHGSuite = {}));
/**
*
* @param {Series} series
* @returns {Number} Total games of the series
*/
function CalculateSeriesEloRating(series) {
    //score1 = score of player 1, score 2 = score of player 2
    //s1 = 1 if player 1 wins, s1 = 0 if player 2 wins, s1 = 0.5 if draw
    var score1 = series.player1.GetELO().value;
    var score2 = series.player2.GetELO().value;
    var s1 = (series.GetWinner() == series.player1) ? 1 : 0;
    var k = 40;
    var r1 = Math.pow(10, score1 / 400);
    var r2 = Math.pow(10, score2 / 400);
    var s2 = Math.abs(s1 - 1);
    var final = [score1 + k * (s1 - (r1 / (r1 + r2))), score2 + k * (s2 - (r2 / (r1 + r2)))];
    series.player1.SetELO(final[0], (series.player1wins + series.player2wins + series.draws));
    series.player2.SetELO(final[1], (series.player1wins + series.player2wins + series.draws));
}
/**
*
* @param {Series} series
*/
function CalculateGamesEloRating(series) {
    //score1 = score of player 1, score 2 = score of player 2
    //s1 = 1 if player 1 wins, s1 = 0 if player 2 wins, s1 = 0.5 if draw
    var score1 = series.player1.GetELO().value;
    var score2 = series.player2.GetELO().value;
    for (var g = 0; g < series.player1wins; g++) {
        var s1 = 1;
        proccess();
    }
    for (var g = 0; g < series.player2wins; g++) {
        var s1 = 0;
        proccess();
    }
    for (var g = 0; g < series.draws; g++) {
        var s1 = 0.5;
        proccess();
    }
    function proccess() {
        var k = 40;
        var r1 = Math.pow(10, score1 / 400);
        var r2 = Math.pow(10, score2 / 400);
        var s2 = Math.abs(s1 - 1);
        var final = [score1 + k * (s1 - (r1 / (r1 + r2))), score2 + k * (s2 - (r2 / (r1 + r2)))];
        score1 = final[0];
        score2 = final[1];
        series.player1.SetELO(final[0]);
        series.player2.SetELO(final[1]);
    }
}
var getInternalSpreadSheet = function () {
    return SpreadsheetApp.openById("1zQMN_t94oS55TwO5kI7p-QRkJti0dRwvGwEuGqkxMY4");
};
var getExternalSpreadSheet = function () {
    return SpreadsheetApp.getActive();
};
