// -------------------------------- Tools -------------------------------- 
function FlushFormulas() {
    var eloformula = RankingSheet.getRange(1, 5).getFormula();
    var statsformule = PlayerIndepthStatsSheet.getRange("A2:Z2").getFormulas();
    RankingSheet.getRange(1, 5).clearContent();
    PlayerIndepthStatsSheet.getRange("A2:Z2").clearContent();
    SpreadsheetApp.flush();
    RankingSheet.getRange(1, 5).setFormula(eloformula);
    PlayerIndepthStatsSheet.getRange("A2:Z2").setFormulas(statsformule);
    SpreadsheetApp.flush();
}
var Tools = {
    /**
    * Turn object properties into a set of array
    * @param {Object} object
    * @returns {Array}
    */
    Arrayify: function (object) {
        var list = [];
        for (var key in object) {
            var element = object[key];
            list.push(element);
        }
        return list;
    },
    /**
    * Pad 0 to make a fixed length number
    * @param {Number} number
    * @param {Number} length
    * @returns {String}
    */
    NumberPadding: function (number, length, z) {
        z = z || '0';
        number = number + '';
        return number.length >= length ? number : new Array(length - number.length + 1).join(z) + number;
    },
    /**
    * Sort all the sheets
    */
    SortSheets: function () {
        try {
            LoadValidationSheets();
            PlayerStatsSheet.sort(1);
            PlayerStatsSheet.sort(11);
            RankingSheet.sort(1);
            HistorySheet.sort(1);
            FullLogSheet.sort(1, false);
            ManagementLogSheet.sort(1, false);
        }
        catch (e) {
            /** @type {Error} */
            var error = e;
            Logger.log(error.message);
            Logger.log(error.stack);
            Logger.log(Logger.getLog());
            var payload = {
                content: "**Script Error Report**\n" + "```sql\n" + Logger.getLog() + "```"
            };
            SendTestWebHook(payload);
        }
    },
    /**
     *
     * @param {Number} mip
     * @returns {Boolean}
     */
    MIPWarningPeriod: function (mip) {
        return ((HolidayModeMIP.HM - mip) % 2 != 0 && mip >= (HolidayModeMIP.HM - 7) && mip != (HolidayModeMIP.HM - 5) && (HolidayModeMIP.HM - mip) > 0);
    },
    /**
     *
     * @param {Number} mip
     * @returns {Boolean}
     */
    DemotionWarningPeriod: function (mip) {
        return ((HolidayModeMIP.DE - mip) % 2 != 0 && mip >= (HolidayModeMIP.DE - 7) && mip != (HolidayModeMIP.DE - 5) && (HolidayModeMIP.DE - mip) > 0);
    }
};
