var MKOTHGSuite;
(function (MKOTHGSuite) {
    var tools = /** @class */ (function () {
        function tools() {
        }
        /**
        * Turn object properties into a set of array
        */
        tools.prototype.arrayify = function (object) {
            var list = [];
            for (var key in object) {
                var element = object[key];
                list.push(element);
            }
            return list;
        };
        /**
        * Pad 0 to make a fixed length number
        */
        tools.prototype.numberPadding = function (number, length, z) {
            z = z || '0';
            var numberStr = number + '';
            return numberStr.length >= length ? numberStr : new Array(length - numberStr.length + 1).join(z) + numberStr;
        };
        tools.prototype.isMIPWarningPeriod = function (baseDays, mip) {
            var isOdd = (baseDays - mip) % 2 != 0;
            var lessThan7days = mip >= (baseDays - 7);
            var not5days = mip != (baseDays - 5);
            var moreThan0days = (baseDays - mip) > 0;
            return (isOdd && lessThan7days && not5days && moreThan0days);
        };
        tools.prototype.computeMD5Hash = function (content) {
            var digest = Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, content, Utilities.Charset.UTF_8);
            return getHash(digest);
            function getHash(numbers) {
                var output = "";
                numbers.forEach(function (element) {
                    output += (element < 0 ? element + 256 : element).toString(16);
                });
                return output;
            }
        };
        return tools;
    }());
    MKOTHGSuite.Tools = new tools();
})(MKOTHGSuite || (MKOTHGSuite = {}));
Object.defineProperty(Array.prototype, 'find', {
    value: function (predicate) {
        // 1. Let O be ? ToObject(this value).
        if (this == null) {
            throw new TypeError('"this" is null or not defined');
        }
        var o = Object(this);
        // 2. Let len be ? ToLength(? Get(O, "length")).
        var len = o.length >>> 0;
        // 3. If IsCallable(predicate) is false, throw a TypeError exception.
        if (typeof predicate !== 'function') {
            throw new TypeError('predicate must be a function');
        }
        // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
        var thisArg = arguments[1];
        // 5. Let k be 0.
        var k = 0;
        // 6. Repeat, while k < len
        while (k < len) {
            // a. Let Pk be ! ToString(k).
            // b. Let kValue be ? Get(O, Pk).
            // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
            // d. If testResult is true, return kValue.
            var kValue = o[k];
            if (predicate.call(thisArg, kValue, k, o)) {
                return kValue;
            }
            // e. Increase k by 1.
            k++;
        }
        // 7. Return undefined.
        return undefined;
    },
    configurable: true,
    writable: true
});
