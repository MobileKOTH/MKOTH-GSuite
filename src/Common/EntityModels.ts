namespace MKOTHGSuite.Models
{
    import IEntity = EntitySystem.IEntity;

    export class PlayerEntity implements IEntity
    {
        id: string;
        name: string;
        class: string = PlayerClassName.Peasant;
        isKnight: boolean = false;
        rank: number;
        points: number;
        joinDate: Date = new Date();
        discordId: number;
        winsAll: number;
        lossAll: number;
        drawsAll: number;
        winsMain: number;
        lossMain: number;
        drawsMain: number;
        elo: number = 1200;
        missingInProgressDays: number;
        status: PlayerStatus = PlayerStatus.Active;
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
        player1Name: string;
        player2Name: string;
        player1Id: string;
        player2Id: string;
        player1Wins: number;
        player2Wins: number;
        draws: number;
        gameInviteCode: string;
    }

    export class RawSeriesEntity extends SeriesEntity
    {
        submissionKey: number;
        maths1: string;
        maths2: string;
        maths3: string;
    }
}