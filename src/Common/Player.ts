namespace MKOTHGSuite
{
    import ActionResult = MKOTHGSuite.Actions.ActionResult;

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

    export enum PlayerStatus
    {
        Active = "Active",
        Holiday = "Holiday",
        Removed = "Removed"
    }

    export class HolidayModeMIP
    {
        private static get holidayMode()
        {
            var iterations = RankList.GetLastPosition() > HolidayModeMIP.RankSafeCap ? 0 : HolidayModeMIP.RankSafeCap - RankList.GetLastPosition();
            var increment = Math.floor((Math.pow((((1 + Math.sqrt(5)) / 2)), iterations) - Math.pow((((1 - Math.sqrt(5)) / 2)), iterations)) / Math.sqrt(5));
            return this.BaseDays + increment;
        }

        static readonly BaseDays = 30;
        static readonly RankSafeCap = 70;
        static readonly CommonDemotion = 7;
        static readonly HolidayMode = HolidayModeMIP.holidayMode;
        static readonly EliteDemotion = HolidayModeMIP.BaseDays;
    }

    const PlayerEnitiy = MKOTHGSuite.Models.PlayerEntity;

    export class Players
    {
        private static entitySet = MKOTHGSuite.EntitySets.GetPlayerEntitySet();
        private static playerList = Players.entitySet.load();

        public static add(playerName: string, discordId: number)
        {
            if (this.playerList.every(x => x.name != playerName))
            {
                var player = new PlayerEnitiy();

                player.name = playerName;
                player.discordId = discordId;
                player.rank = this.playerList.filter(x => x.status == PlayerStatus.Active).length + 1;

                this.playerList.push();
                return new ActionResult();
            }
            else
            {
                return new ActionResult(false, "Player already exist: " + playerName)
            }
        }

        public static update()
        {
            this.entitySet.update(this.playerList);
        }
    }
}