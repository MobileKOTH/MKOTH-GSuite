/// <reference path="Models/EntityModels.ts" />

namespace MKOTHGSuite
{
    import ActionResult = MKOTHGSuite.Actions.ActionResult;
    import PlayerEntity = Models.PlayerEntity;
    import SeriesEntity = Models.SeriesEntity;
    import RawSeriesEntity = Models.RawSeriesEntity;

    export enum PlayerStatus
    {
        Active = "Active",
        Holiday = "Holiday",
        Removed = "Removed"
    }

    export enum PlayerClassName
    {
        King = "King",
        Nobleman = "Nobleman",
        Squire = "Squire",
        Vassal = "Vassal",
        Peasant = "Peasant",
    }

    /** The max cap rank possition of a class */
    export enum PlayerClassBaseRankCap
    {
        King = 1,
        Nobleman = 10,
        Squire = 30,
        Vassal = 50,
    }

    class PlayerClassELORankCap
    {
        Nobleman: number;
        Squire: number;
        Vassal: number;
    }

    class PlayerELOTiers
    {
        Nobleman: number;
        Squire: number;
        Vassal: number;
    }

    export class HolidayModeMIP
    {
        private static get holidayMode()
        {
            var iterations = Players.lastActiveRank > HolidayModeMIP.RankSafeCap ? 0 : HolidayModeMIP.RankSafeCap - Players.lastActiveRank;
            var increment = Math.floor((Math.pow((((1 + Math.sqrt(5)) / 2)), iterations) - Math.pow((((1 - Math.sqrt(5)) / 2)), iterations)) / Math.sqrt(5));
            return this.BaseDays + increment;
        }

        static readonly BaseDays = 30;
        static readonly RankSafeCap = 70;
        static readonly CommonDemotion = 7;
        static readonly HolidayMode = HolidayModeMIP.holidayMode;
        static readonly EliteDemotion = HolidayModeMIP.BaseDays;
    }

    export class Players
    {
        private static _internalList: PlayerEntity[];
        private static _externalList: PlayerEntity[];

        public static get InternalPlayerList()
        {
            if (!this._internalList)
            {
                this._internalList = MKOTHGSuite.EntitySets.GetInternalPlayerEntitySet().load();
            }
            return this._internalList;
        }

        public static get ExternalPlayerList()
        {
            if (!this._externalList)
            {
                this._externalList = MKOTHGSuite.EntitySets.GetExternalPlayerEntitySet().load();
            }
            return this._externalList;
        }

        public static get lastActiveRank(): number
        {
            return this.InternalPlayerList
                .filter(x => x.status == PlayerStatus.Active)
                .length + 1;
        }

        public static get classELORankCap(): PlayerClassELORankCap
        {
            throw new Error("Not implemented");
        }

        public static add(playerName: string, discordId: number, joinDate: Date = new Date())
        {
            if (playerName == "") 
            {
                return new ActionResult(false, "Name is empty.");
            }

            if (this.InternalPlayerList.every(x => x.name.toLowerCase() != playerName.toLowerCase()))
            {
                var player = new PlayerEntity(
                    {
                        name: playerName,
                        rank: this.lastActiveRank,
                        joinDate: joinDate,
                        discordId: discordId
                    });

                this.InternalPlayerList.push(player);
                return new ActionResult();
            }
            else
            {
                return new ActionResult(false, "Player already exist: " + playerName)
            }
        }

        public static remove(id: string)
        {
            var player = this.InternalPlayerList.find(x => x.id == id);
            if (player)
            {
                if (player.status == PlayerStatus.Removed)
                {
                    return new ActionResult(false, "Player already removed");
                }
                else
                {
                    this.removeToRank(player);
                    player.rank = 0;
                    player.status = PlayerStatus.Removed;
                    player.class = player.class == PlayerClassName.King || player.class == PlayerClassName.Nobleman ? PlayerClassName.Squire : player.class;
                    return new ActionResult();
                }
            }
            else
            {
                return new ActionResult(false, "Player not found: " + id);
            }
        }

        public static reAdd(id: string)
        {
            var player = this.InternalPlayerList.find(x => x.id == id);
            if (player) 
            {
                if (player.status != PlayerStatus.Removed) 
                {
                    return new ActionResult(false, "Player not removed");
                }
                var rankCap = this.classELORankCap[player.class];
                player.rank = rankCap;
                player.status = PlayerStatus.Active;
                this.insertToRank(player);
            }
            else
            {
                return new ActionResult(false, "Player not found: " + id);
            }
        }

        public static removeToRank(player: PlayerEntity)
        {
            var affected = this.InternalPlayerList
                .filter(x => x.status == PlayerStatus.Active)
                .filter(x => x.rank > player.rank);
            affected.forEach(x => x.rank--)
            return this.InternalPlayerList;
        }

        public static insertToRank(player: PlayerEntity)
        {
            var affected = this.InternalPlayerList
                .filter(x => x.status == PlayerStatus.Active)
                .filter(x => x.rank >= player.rank && x.id != player.id);
            affected.forEach(x => x.rank++)
            return this.InternalPlayerList;
        }

        public static moveUpToRank(player: PlayerEntity, targetRank: number)
        {
            this.removeToRank(player);
            player.rank = targetRank;
            this.insertToRank(player);
            return this.InternalPlayerList;
        }

        public static changePoints(id: string, pointChange: number)
        {
            var player = this.InternalPlayerList.find(x => x.id == id);
            if (player) 
            {
                player.points += pointChange;
                return new ActionResult();
            }
            else
            {
                return new ActionResult(false, "Player not found: " + id)
            }
        }

        public static rename(id: string, newName: string)
        {
            var player = this.InternalPlayerList.find(x => x.id == id);
            if (player) 
            {
                player.name = newName;
                return new ActionResult();
            }
            else
            {
                return new ActionResult(false, "Player not found: " + id);
            }
        }

        public static search(options: { name?: string, discordId?: number, id?: string })
        {
            var searchOption = Tools.getDefinedOptionKeyValue(options);
            var player = this.InternalPlayerList.find(x => x[searchOption.key] == searchOption.value);
            return player;
        }

        public static update()
        {
            return EntitySets.GetInternalPlayerEntitySet().update(this.InternalPlayerList);
        }

        public static sync()
        {
            return EntitySets.GetExternalPlayerEntitySet().update(this.InternalPlayerList);
        }

        public static revert()
        {
            return EntitySets.GetInternalPlayerEntitySet().update(this.ExternalPlayerList);
        }

        public static test()
        {
            Logger.log("test");
        }
    }
}