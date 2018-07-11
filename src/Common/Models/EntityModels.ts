namespace MKOTHGSuite.Models
{
    import IEntity = EntitySystem.IEntity;

    export class PlayerEntity implements IEntity
    {
        id: string; // supply
        name: string; // supply
        class: PlayerClassName = PlayerClassName.Peasant;
        isKnight: boolean = false;
        rank: number; // supply
        points: number = 0;
        joinDate: Date; // supply
        discordId: number; // supply
        winsAll: number = 0;
        lossAll: number = 0;
        drawsAll: number = 0;
        winsMain: number = 0;
        lossMain: number = 0;
        drawsMain: number = 0;
        elo: number = 1200;
        missingInProgressDays: number;
        status: PlayerStatus = PlayerStatus.Active;

        constructor(options:
            {
                name: string,
                rank: number,
                joinDate: Date,
                discordId: number
            })
        {
            this.id = Tools.computeMD5Hash(options.name + options.joinDate);
            this.name = options.name;
            this.rank = options.rank;
            this.joinDate = options.joinDate;
            this.discordId = options.discordId;
        }
    }

    export class PlayerKeyEntity implements IEntity
    {
        id: string;
        key: number;
    }

    export class SeriesEntity implements IEntity
    {
        id: string;
        date: Date;
        type: SeriesType;
        player1Id: string;
        player2Id: string;
        player1Wins: number;
        player2Wins: number;
        draws: number;
        gameInviteCode: string;
    }

    export class RawSeriesEntity extends SeriesEntity
    {
        player1Name: string;
        player2Name: string;
        submissionKey: number;
        maths1: string;
        maths2: string;
        maths3: string;
    }
}