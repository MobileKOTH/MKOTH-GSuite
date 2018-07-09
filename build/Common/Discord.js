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
    var WebHook = /** @class */ (function () {
        function WebHook() {
        }
        Object.defineProperty(WebHook, "MKOTHServerWebHookURL", {
            get: function () {
                return PropertiesService.getScriptProperties().getProperty("MKOTHServerWebHookURL");
            },
            enumerable: true,
            configurable: true
        });
        return WebHook;
    }());
    Discord.WebHook = WebHook;
})(Discord || (Discord = {}));
