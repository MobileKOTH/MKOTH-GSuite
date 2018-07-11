namespace Discord
{
    export class EmbedBuilder
    {
        title: string;
        description: string;
        fields: EmbedFieldBuilder[];

        withTitle(input: string)
        {
            this.title = input;
            return this;
        }

        withDescription(input: string)
        {
            this.description = input
        }

        addField(name: string, value: string, inline: boolean = true)
        {
            if (this.fields.length < 25)
            {
                this.fields.push(new EmbedFieldBuilder()
                    .withName(name)
                    .withValue(value)
                    .isWithInline(inline));
            }
            return this;
        }

        toJSON()
        {
            return JSON.stringify(this);
        }
    }

    class EmbedFieldBuilder
    {
        name: string;
        value: string;
        inline: boolean;

        withName(input: string)
        {
            this.name = input;
            return this;
        }

        withValue(input: string)
        {
            this.value = input;
            return this;
        }

        isWithInline(input: boolean)
        {
            this.inline = input;
            return this;
        }
    }
}