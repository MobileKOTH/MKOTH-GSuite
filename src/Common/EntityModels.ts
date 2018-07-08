import IEntity = EntitySystem.IEntity;

class PlayerEntity implements IEntity
{
    id: string;
    name: string;
    class: string;
    isKnight: boolean;
    rank: number;
    points: number;
    joinDate: Date;
    discordId: number;
    winsAll: number;
    lossAll: number;
    drawsAll: number;
    winsMain: number;
    lossMain: number;
    drawsMain: number;
    elo: number;
    missingInProgressDays: number;
    status: PlayerStatus;
}

class PlayerKeyEntity implements IEntity
{
    id: string;
    key: number;
}

class SeriesEntity implements IEntity
{
    id: string;
    date: Date;
    type: SeriesType;
    player1Name: string;
    player2Name: string;
    player1Wins: number;
    player2Wins: number;
    draws: number;
    gameInviteCode: string;
}

class RawSeriesEntity extends SeriesEntity
{
    submissionKey: number;
    maths1: string;
    maths2: string;
    maths3: string;
}