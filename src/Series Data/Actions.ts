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
      public message: string = "Success!") { }
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

    invoke()
    {
      return Players.add(this.playerName, this.discordId);
    }
  }

  export function RunActions<T extends ActionBase>(actions: T[])
  {
    actions.forEach(x =>
    {
      var result = x.invoke();
      if (!result.success) 
      {
        throw new Error(`Failed executing: ${x.stringify()}`)
      }
    })

    Players.update();
  }
}

function PostSeriesInstructionWebhook()
{
  var payload =
  {
    "content": "For MKOTH related commands: `.mkothhelp` (Beta)",
    "embeds":
      [
        {
          "author": { "name": "RULES OF SERIES SUBMISSION", "icon_url": "https://cdn.discordapp.com/attachments/341163606605299716/352709311442452490/checklist.png" },
          "title": null,
          "description": "ᅠ",
          "timestamp": new Date(),
          "footer": { "text": "Updated" },
          "fields":
            [
              { "name": "1. Only winners will submit the series", "value": "Prepare one of the game invite codes used for the series and your submission ID (type `.myid` and check DM if you do not have one), submit a series by using the form provided below.", "inline": false },
              { "name": "2. The earlier you submit your series the better", "value": "E.g Player A completes his series with player B on 10/13/16, and submits their series on the same day. Player C and player D completes their series on 9/10/16 but submits their submits series on 11/13/16, it will be recorded that player A and B played their series first.", "inline": false },
              { "name": "3. Double check your submitted series below", "value": "If you accidentally submitted a series with wrong information, approach an admin IMMEDIATELY as severe errors cannot be undone. If the your entered submission ID does not match the one provided by us, or detected you are not the winner, the submission will be automatically rejected. Only if the series is auto rejected, please make sure you are the winner and submit again with correct ID.", "inline": false },
              { "name": "4. Rankings are usually updated once daily", "value": "Your submitted series will not be reflected immediately on the ranking sheet. They will append below to be checked. All auto-generated validation messages below are based on the last ranking update, so in rare cases, conflicts might occur as the validation check does not take into account any pending series.", "inline": false },
              { "name": "5. No falsification", "value": "SUBMITTING A FALSE SERIES WILL RESULT IN A PERMANENT BAN FROM MKOTH.\nᅠ", "inline": false },
              { "name": "Rank and Player Stats", "value": "Google Sheets: [MKOTH Series Data](https://docs.google.com/spreadsheets/d/1VRfWwvRSMQizzBanGNRMFVzoYFthrsNKzOgF5wKVM5I)", "inline": false },
              { "name": "Series Submission Form", "value": "Google Forms: [MKOTH Series Submission Form](https://docs.google.com/forms/d/e/1FAIpQLSdGJnCOl0l5HjxuYexVV_sOKPR1iScq3eiSxGiqKULX3zG4-Q/viewform)\nᅠ", "inline": false },
              { "name": "Attributions", "value": "Icons made by [Vectors Market](https://www.flaticon.com/authors/vectors-market), [Swifticons](https://www.flaticon.com/authors/swifticons) and [Freepik](http://www.freepik.com) from [Flaticon](https://www.flaticon.com) are licensed by [CC 3.0 BY](http://creativecommons.org/licenses/by/3.0/)", "inline": false }
            ],
          "color": 9803157
        }
      ]
  };
  SendWebHook(payload);
}