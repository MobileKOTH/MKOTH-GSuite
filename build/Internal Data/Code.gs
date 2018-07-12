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
/// <reference path="Models/EntityModels.ts" />
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
            for (var key_1 in options) {
                if (options.hasOwnProperty(key_1)) {
                    return { key: key_1, value: options[key_1] };
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
/// <reference path="../EntitySystem/EntitySet.ts" />
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
function doGet(e) {
}
var getInternalSpreadSheet = function () { return SpreadsheetApp.getActive(); };
var getExternalSpreadSheet = function () { return SpreadsheetApp.openById("1VRfWwvRSMQizzBanGNRMFVzoYFthrsNKzOgF5wKVM5I"); };
var CodeList = PlayerCodeSheet.getRange(1, 2, PlayerCodeSheet.getLastRow(), 1).getValues();
function GeneratePlayerCode() {
    for (var i = 0; i < CodeList.length; i++) {
        var element = CodeList[i];
        if (element[0] == "") {
            var code = RandomRange(100000, 999999);
            while (HasCodeRepeat(code)) {
                code = RandomRange(100000, 999999);
            }
            CodeList[i][0] = code;
            PlayerCodeSheet.getRange(i + 1, 2).setValue(code);
        }
    }
    var coderegex = "";
    CodeList = shuffle(CodeList);
    for (var i = 0; i < CodeList.length; i++) {
        var element = CodeList[i];
        if (typeof (element[0]) == "number") {
            coderegex += new String(element[0]).substring(0, 3) + "|";
        }
    }
    coderegex = coderegex.substring(0, coderegex.length - 1);
    var codeitem = Form.getItems()[6].asTextItem();
    var codevalidation = FormApp.createTextValidation();
    codevalidation.requireTextMatchesPattern("^(" + coderegex + ")[0-9]{3}$");
    codevalidation.setHelpText("Invalid Code!");
    codevalidation = codevalidation.build();
    codeitem.setValidation(codevalidation);
    PlayerCodeSheet.sort(1);
    PostPlayerCodeWebHook();
    /**
    *
    * @param {Number} code
    * @returns {Boolean}
    */
    function HasCodeRepeat(code) {
        for (var i = 0; i < CodeList.length; i++) {
            var element = CodeList[i];
            if (typeof (element[0]) == "number") {
                if (element == code) {
                    return true;
                }
            }
        }
        return false;
    }
}
function PostPlayerCodeWebHook() {
    var playerCodeList = PlayerCodeSheet.getRange(1, 1, PlayerCodeSheet.getLastRow(), 2).getValues();
    var fields = [];
    var payload;
    for (var pc = 1; pc < playerCodeList.length; pc++) {
        var element = playerCodeList[pc];
        for (var pl = 0; pl < PlayerList.length; pl++) {
            var player = PlayerList[pl];
            if (player.name == element[0] && !player.isRemoved) {
                fields.push({ name: element[0], value: element[1] });
                if (fields.length == 25) {
                    do {
                        payload =
                            {
                                content: null,
                                embeds: [{ fields: fields }]
                            };
                    } while (!SendWebHook(payload));
                    fields = [];
                }
            }
        }
    }
    do {
        payload =
            {
                content: null,
                embeds: [{ fields: fields }]
            };
    } while (!SendWebHook(payload));
}
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}
//Global Constants
var ValidationSheetApp = SpreadsheetApp.openById("1zQMN_t94oS55TwO5kI7p-QRkJti0dRwvGwEuGqkxMY4");
var DataSheetApp = SpreadsheetApp.openById("1VRfWwvRSMQizzBanGNRMFVzoYFthrsNKzOgF5wKVM5I");
var ValidationSheet = ValidationSheetApp.getSheetByName("Series Form Submissions");
var PlayerCodeSheet = ValidationSheetApp.getSheetByName("Player Code");
var FullLogSheet = ValidationSheetApp.getSheetByName("Full Logs");
var HistorySheet = DataSheetApp.getSheetByName("Series History");
var RankingSheet = DataSheetApp.getSheetByName("Rankings");
var PlayerStatsSheet = DataSheetApp.getSheetByName("Player Statistics");
var ManagementLogSheet = DataSheetApp.getSheetByName("Management Logs");
var Form = FormApp.openById("1Ccym-20keX_AbFlELm1s0nYNsST71GJMzUcIusz7bIU");
var lastRow = ValidationSheet.getRange(ValidationSheet.getLastRow(), 1, 1, 13);
var previousInviteCodesRange = ValidationSheet.getRange(1, 13, (ValidationSheet.getLastRow() <= 1) ? 1 : ValidationSheet.getLastRow() - 1, 1).getValues();
var previousInviteCodes = [];
var validgamecode = true;
for (var key in previousInviteCodesRange) {
    if (previousInviteCodesRange.hasOwnProperty(key)) {
        var element = previousInviteCodesRange[key];
        previousInviteCodes.push(element[0]);
    }
}
function Main() {
}
function onOpen() {
    //Create Manament Context Menu
    ValidationSheetApp.addMenu("Management", [
        { name: "Update Player Code", functionName: "GeneratePlayerCode" },
        { name: "Resubmit Series", functionName: "ResubmitSeries" },
        { name: "Swap Players", functionName: "SwapSeriesPlayers" }
    ]);
}
function ResubmitSeries() {
    var input = Browser.inputBox("Series Resubmission", "Select Row to resubmit", Browser.Buttons.OK_CANCEL);
    if (input == "cancel") {
        return;
    }
    var row = Number(input);
    if (!isNaN(row) && input != "") {
        if (row <= ValidationSheet.getLastRow()) {
            lastRow = ValidationSheet.getRange(row, 1, 1, 13);
            previousInviteCodesRange = ValidationSheet.getRange(1, 13, (row <= 1) ? 1 : row - 1, 1).getValues();
            previousInviteCodes = [];
            for (var key in previousInviteCodesRange) {
                if (previousInviteCodesRange.hasOwnProperty(key)) {
                    var element = previousInviteCodesRange[key];
                    previousInviteCodes.push(element[0]);
                }
            }
            onFormSubmit();
            return;
        }
        Browser.msgBox("Invalid input!");
        return;
    }
    Browser.msgBox("Invalid input!");
}
function SwapSeriesPlayers() {
    var input = Browser.inputBox("Series Players Swap", "Select Row to swap", Browser.Buttons.OK_CANCEL);
    if (input == "cancel") {
        return;
    }
    var row = Number(input);
    if (!isNaN(row) && input != "") {
        if (row <= ValidationSheet.getLastRow()) {
            var seriesData = ValidationSheet.getRange(row, 3, 1, 4).getValues()[0];
            ValidationSheet.getRange(row, 3, 1, 4).setValues([[seriesData[1], seriesData[0], seriesData[3], seriesData[2]]]);
            ValidationSheet.getRange(row, 9, 1, 1).getCell(1, 1).clear();
            ManagementLogSheet.appendRow([new Date(), "Swap Series Players", JSON.stringify({ "From": seriesData, "To": [seriesData[1], seriesData[0], seriesData[3], seriesData[2]] })]);
            return;
        }
        Browser.msgBox("Invalid input!");
        return;
    }
    Browser.msgBox("Invalid input!");
}
function onFormSubmit(e) {
    var runTime = new Date().getTime();
    var lastrowvalues = lastRow.getValues()[0];
    var validationcode = lastrowvalues[7];
    var validation = [];
    validation.push(lastrowvalues[9]);
    validation.push(lastrowvalues[10]);
    validation.push(lastrowvalues[11]);
    var answer = "";
    var gamecode = lastrowvalues[12];
    var haswronganswer = false;
    var validationstatus = " -> passed`\n";
    for (var i = 0; i < validation.length; i++) {
        answer = String(validation[i]);
        if (answer.length > 0 && answer != "NOT APPLICABLE") {
            var answerparts = answer.split(" ");
            var a = Number(answerparts[0]);
            var b = Number(answerparts[2]);
            var c = Number(answerparts[4]);
            if (a + b != c) {
                haswronganswer = true;
                lastRow.getCell(1, 10 + i).setBackground("red");
                validationstatus = " -> failed, the series will probed.`\n";
            }
            else {
                lastRow.getCell(1, 10 + i).setBackground("#6AA84F");
            }
            break;
        }
    }
    if (haswronganswer) {
        lastRow.getCell(1, 9).setValue("Submission failed maths");
        lastRow.getCell(1, 9).setBackground("red");
    }
    var series = new Series(lastrowvalues[0], lastrowvalues[1], lastrowvalues[2], lastrowvalues[3], lastrowvalues[4], lastrowvalues[5], lastrowvalues[6]);
    if (!IsValidPlayerCode(validationcode, series)) {
        var content = "`Webhook delay: " + (runTime - series.date.getTime()) + " ms`\n" +
            "A submission has been automatically rejected due to invalid identification code for the winner.\n" +
            "```json\n" + JSON.stringify(series) + "\n```";
        var payload = {
            "content": content,
        };
        var options = {
            'method': 'post',
            'contentType': 'application/json',
            'payload': JSON.stringify(payload),
        };
        var response = UrlFetchApp.fetch(Webhookurl, options);
        Logger.log(response.getHeaders());
        FullLogSheet.appendRow([new Date(), "Submission Rejection", JSON.stringify(lastRow.getValues())]);
        FullLogSheet.sort(1, false);
        ValidationSheet.deleteRow(ValidationSheet.getLastRow());
        return;
    }
    var seriestype = "Series Type: " + series.type;
    var seriesicon = GenerateSeriesIcon(series);
    var sheeturl = "https://docs.google.com/spreadsheets/d/1zQMN_t94oS55TwO5kI7p-QRkJti0dRwvGwEuGqkxMY4";
    var title = GenerateSeriesTitle(series);
    var description = "`validation: " + answer + validationstatus;
    if (!series.isValid()) {
        description += "However, " + invalidReason.toLowerCase() + ", the series will be audited. Note that the series is not rejected, this message is just a warning as it does not take account for any pending series above, refer to submission rule #4\n";
        lastRow.getCell(1, 9).setValue(invalidReason);
        lastRow.getCell(1, 9).setBackground("red");
    }
    description += GetBattleTVLinkString(gamecode);
    var color = GenerateSeriesColor(series, haswronganswer);
    var content = "`Webhook delay: " + (runTime - series.date.getTime()) + " ms`\n" + GenerateWinText(series);
    var payload = {
        "content": content,
        "embeds": [
            {
                "author": {
                    "name": seriestype,
                    "icon_url": seriesicon
                },
                "url": sheeturl,
                "title": title,
                "description": description,
                "timestamp": lastRow.getCell(1, 1).getValue(),
                "footer": {
                    "text": "Submission Time",
                    "icon_url": "https://cdn.discordapp.com/attachments/341163606605299716/352026248773500939/schedule.png"
                },
                "fields": [
                    { "name": lastRow.getCell(1, 3).getValue(), "value": lastRow.getCell(1, 5).getValue(), "inline": true },
                    { "name": lastRow.getCell(1, 4).getValue(), "value": lastRow.getCell(1, 6).getValue(), "inline": true }
                ],
                "color": color
            }
        ]
    };
    var options = {
        'method': 'post',
        'contentType': 'application/json',
        'payload': JSON.stringify(payload),
    };
    var response = UrlFetchApp.fetch(Webhookurl, options);
    Logger.log(response.getHeaders());
}
/**
*
* @param {Series} series
* @returns {String}
*/
function GenerateWinText(series) {
    var winnerping = "<@!" + series.GetWinner().discordid + "> (Rank: " + series.GetWinner().rank + " Points: " + series.GetWinner().points + ")";
    var loserping = "<@!" + series.GetLoser().discordid + "> (Rank: " + series.GetLoser().rank + " Points: " + series.GetLoser().points + ")";
    var scoretext = "";
    if (series.player1wins > series.player2wins) {
        scoretext = series.player1wins + " : " + series.player2wins;
    }
    else {
        scoretext = series.player2wins + " : " + series.player1wins;
    }
    var pointchange = 0;
    if (series.GetWinner() == series.player1) {
        pointchange = series.GetRewardPoints() - series.GetCostPoint();
    }
    else {
        pointchange = series.GetRewardPoints();
    }
    var gainlosspointtext = "";
    if (pointchange >= 0) {
        gainlosspointtext = " to gain " + pointchange;
    }
    else {
        gainlosspointtext = " to lose " + Math.abs(pointchange);
    }
    var content = winnerping + " has defeated " + loserping + gainlosspointtext + " points in a " + series.type + " series to with a score of " + scoretext;
    return content;
}
/**
*
* @param {Series} series
* @returns {String}
*/
function GenerateSeriesTitle(series) {
    switch (series.type) {
        case SeriesType.POINT:
            return "A point series has submited";
            break;
        case SeriesType.RANKED:
            if (series.player1wins > series.player2wins) {
                return "A challenger has won to take the rank of " + series.player2.rank + "!";
            }
            else {
                return "A defender has won!";
            }
            break;
        case SeriesType.KNIGHT:
            if (series.player1wins > series.player2wins) {
                return "A knight challenger has won to become a Nobleman!";
            }
            else {
                return "A knight has successfully defended our king!";
            }
            break;
        case SeriesType.KING:
            if (series.player1wins > series.player2wins) {
                return "ALL HAIL TO OUR NEW KING: " + series.GetWinner().name + "!";
            }
            else {
                return "A King has successfully defended his throne!";
            }
            break;
    }
}
/**
*
* @param {Series} series
* @returns {String}
*/
function GenerateSeriesIcon(series) {
    switch (series.type) {
        case SeriesType.POINT:
            return "https://cdn.discordapp.com/attachments/341163606605299716/351982100020461569/trophy.png";
            break;
        case SeriesType.RANKED:
            return "https://cdn.discordapp.com/attachments/341163606605299716/352026221481164801/ranking.png";
            break;
        case SeriesType.KNIGHT:
            return "https://cdn.discordapp.com/attachments/341163606605299716/352026205115121664/strategy.png";
            break;
        case SeriesType.KING:
            return "https://cdn.discordapp.com/attachments/341163606605299716/352026213306335234/crown.png";
            break;
    }
}
/**
*
* @param {Series} series
* @returns {Number}
*/
function GenerateSeriesColor(series, haswronganswer) {
    if (!series.isValid() || haswronganswer || !validgamecode) {
        return 16711680;
    }
    switch (series.type) {
        case SeriesType.POINT:
            return 8947848;
            break;
        default:
            if (series.player2wins > series.player1wins) {
                return 43775;
            }
            else {
                return 16766208;
            }
            break;
    }
}
/**
*
* @param {String} gamecode
* @returns {String}
*/
function GetBattleTVLinkString(gamecode) {
    var battleTVlink = "https://battles.tv/watch/" + gamecode;
    for (var key in previousInviteCodes) {
        if (previousInviteCodes.hasOwnProperty(key)) {
            var element = previousInviteCodes[key];
            if (element == gamecode) {
                validgamecode = false;
                lastRow.getCell(1, 13).setBackground("red");
                lastRow.getCell(1, 9).setBackground("red");
                lastRow.getCell(1, 9).setValue("Repeated game code");
                return "This game code is already used by another series!";
            }
        }
    }
    try {
        var options = { muteHttpExceptions: true };
        var response = UrlFetchApp.fetch(battleTVlink, options);
        if (response.getResponseCode() != 200) {
            validgamecode = false;
            lastRow.getCell(1, 13).setBackground("red");
            lastRow.getCell(1, 9).setBackground("red");
            lastRow.getCell(1, 9).setValue("Invalid game code");
            return "Invalid game code used!";
        }
    }
    catch (error) {
        battleTVlink = error.message;
    }
    return "Battles TV: " + battleTVlink;
}
/**
*
* @param {Number} code
* @param {Series} series
* @returns {Boolean}
*/
function IsValidPlayerCode(code, series) {
    var playerCodeList = PlayerCodeSheet.getRange(1, 1, PlayerCodeSheet.getLastRow(), 2).getValues();
    for (var pc = 0; pc < playerCodeList.length; pc++) {
        var element = playerCodeList[pc];
        if (element[0] == series.GetWinner().name) {
            playercode = element[1];
            if (playercode == code) {
                return true;
            }
        }
    }
    return false;
}
/**
* Returns a range int range from the parameters inclusive.
* @param {number} min
* @param {number} max
* @returns {number}
*/
function RandomRange(min, max) {
    var difference = max - min + 1;
    var randomrange = Math.random() * difference;
    randomrange = Math.floor(randomrange);
    return min + randomrange;
}
