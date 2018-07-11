
namespace MKOTHGSuite.Actions
{
    export enum ActionsType
    {
        AddPlayer
    }

    interface IAction
    {
        date: Date;
        type: ActionsType;

        invoke(): ActionResult;
    }

    export class ActionResult
    {
        constructor(
            public success: boolean = true,
            public message: string = "Success!"
        ) { }
    }

    abstract class ActionBase implements IAction
    {
        date = new Date();
        abstract type: ActionsType;

        parse(json: string): ActionBase
        {
            var action = JSON.parse(json);
            return action as ActionBase;
        }

        stringify(): string
        {
            return JSON.stringify(this);
        }

        abstract invoke(): ActionResult;
    }

    export class AddPlayerAction extends ActionBase
    {
        date = new Date();
        type = ActionsType.AddPlayer;
        playerName: string;
        discordId: number;
        joinDate = new Date();

        invoke()
        {
            return Players.add(this.playerName, this.discordId, this.joinDate);
        }
    }

    export function RunActions<T extends ActionBase>(actions: T[])
    {
        actions.forEach(x =>
        {
            var result = x.invoke();
            if (!result.success) 
            {
                throw new Error(`Failed executing: ${x.stringify()}\n${result.message}`)
            }
        })

        Players.update();
    }
}