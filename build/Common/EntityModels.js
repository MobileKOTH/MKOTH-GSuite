var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var MKOTHGSuite;
(function (MKOTHGSuite) {
    var Models;
    (function (Models) {
        var PlayerEntity = /** @class */ (function () {
            function PlayerEntity() {
                this.class = MKOTHGSuite.PlayerClassName.Peasant;
                this.isKnight = false;
                this.points = 0;
                this.joinDate = new Date();
                this.winsAll = 0;
                this.lossAll = 0;
                this.drawsAll = 0;
                this.winsMain = 0;
                this.lossMain = 0;
                this.drawsMain = 0;
                this.elo = 1200;
                this.status = MKOTHGSuite.PlayerStatus.Active;
            }
            return PlayerEntity;
        }());
        Models.PlayerEntity = PlayerEntity;
        var PlayerKeyEntity = /** @class */ (function () {
            function PlayerKeyEntity() {
            }
            return PlayerKeyEntity;
        }());
        Models.PlayerKeyEntity = PlayerKeyEntity;
        var SeriesEntity = /** @class */ (function () {
            function SeriesEntity() {
            }
            return SeriesEntity;
        }());
        Models.SeriesEntity = SeriesEntity;
        var RawSeriesEntity = /** @class */ (function (_super) {
            __extends(RawSeriesEntity, _super);
            function RawSeriesEntity() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return RawSeriesEntity;
        }(SeriesEntity));
        Models.RawSeriesEntity = RawSeriesEntity;
    })(Models = MKOTHGSuite.Models || (MKOTHGSuite.Models = {}));
})(MKOTHGSuite || (MKOTHGSuite = {}));
