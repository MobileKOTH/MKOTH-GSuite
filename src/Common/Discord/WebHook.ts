namespace Discord
{
    export class WebHook
    {
        static Send(url: string, content: string, embeds: EmbedBuilder[])
        {
            var response = UrlFetchApp.fetch(url);
        }
    }
}