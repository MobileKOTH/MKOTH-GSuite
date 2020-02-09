if (!String.prototype.includes)
{
    String.prototype.includes = function (search, start)
    {
        'use strict';

        if (search instanceof RegExp)
        {
            throw TypeError('first argument must not be a RegExp');
        }
        if (start === undefined) { start = 0; }
        return this.indexOf(search, start) !== -1;
    };
}

// Production steps of ECMA-262, Edition 6, 22.1.2.1
if (!Array.from)
{
    Array.from = (function ()
    {
        var toStr = Object.prototype.toString;
        var isCallable = function (fn)
        {
            return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
        };
        var toInteger = function (value)
        {
            var number = Number(value);
            if (isNaN(number)) { return 0; }
            if (number === 0 || !isFinite(number)) { return number; }
            return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
        };
        var maxSafeInteger = Math.pow(2, 53) - 1;
        var toLength = function (value)
        {
            var len = toInteger(value);
            return Math.min(Math.max(len, 0), maxSafeInteger);
        };

        // The length property of the from method is 1.
        return function from(arrayLike/*, mapFn, thisArg */)
        {
            // 1. Let C be the this value.
            var C = this;

            // 2. Let items be ToObject(arrayLike).
            var items = Object(arrayLike);

            // 3. ReturnIfAbrupt(items).
            if (arrayLike == null)
            {
                throw new TypeError('Array.from requires an array-like object - not null or undefined');
            }

            // 4. If mapfn is undefined, then let mapping be false.
            var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
            var T;
            if (typeof mapFn !== 'undefined')
            {
                // 5. else
                // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
                if (!isCallable(mapFn))
                {
                    throw new TypeError('Array.from: when provided, the second argument must be a function');
                }

                // 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
                if (arguments.length > 2)
                {
                    T = arguments[2];
                }
            }

            // 10. Let lenValue be Get(items, "length").
            // 11. Let len be ToLength(lenValue).
            var len = toLength(items.length);

            // 13. If IsConstructor(C) is true, then
            // 13. a. Let A be the result of calling the [[Construct]] internal method 
            // of C with an argument list containing the single item len.
            // 14. a. Else, Let A be ArrayCreate(len).
            var A = isCallable(C) ? Object(new C(len)) : new Array(len);

            // 16. Let k be 0.
            var k = 0;
            // 17. Repeat, while k < len… (also steps a - h)
            var kValue;
            while (k < len)
            {
                kValue = items[k];
                if (mapFn)
                {
                    A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
                } else
                {
                    A[k] = kValue;
                }
                k += 1;
            }
            // 18. Let putStatus be Put(A, "length", len, true).
            A.length = len;
            // 20. Return A.
            return A;
        };
    }());
}

// https://tc39.github.io/ecma262/#sec-array.prototype.find
if (!Array.prototype.find)
{
    Object.defineProperty(Array.prototype, 'find', {
        value: function (predicate)
        {
            // 1. Let O be ? ToObject(this value).
            if (this == null)
            {
                throw TypeError('"this" is null or not defined');
            }

            var o = Object(this);

            // 2. Let len be ? ToLength(? Get(O, "length")).
            var len = o.length >>> 0;

            // 3. If IsCallable(predicate) is false, throw a TypeError exception.
            if (typeof predicate !== 'function')
            {
                throw TypeError('predicate must be a function');
            }

            // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
            var thisArg = arguments[1];

            // 5. Let k be 0.
            var k = 0;

            // 6. Repeat, while k < len
            while (k < len)
            {
                // a. Let Pk be ! ToString(k).
                // b. Let kValue be ? Get(O, Pk).
                // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
                // d. If testResult is true, return kValue.
                var kValue = o[k];
                if (predicate.call(thisArg, kValue, k, o))
                {
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
}

if (![].entries)
{
    Array.prototype.values = function ()
    {
        var k, a = [], nextIndex = 0, ary = this;
        k = ary.length;
        while (k > 0) a[--k] = [k, ary[k]];
        a.next = function ()
        {
            return nextIndex < ary.length ?
                { value: [nextIndex++, ary[nextIndex]], done: false } :
                { done: true };
        };
        return a;
    };
}

if (![].keys)
{
    Array.prototype.keys = function ()
    {
        var k, a = [], nextIndex = 0, ary = this;
        k = ary.length;
        while (k > 0) a[--k] = k;
        a.next = function ()
        {
            return nextIndex < ary.length ?
                { value: nextIndex++, done: false } :
                { done: true };
        };
        return a;
    };
}

if (![].values)
{
    Array.prototype.values = function ()
    {
        var k, a = [], nextIndex = 0, ary = this;
        k = ary.length;
        while (k > 0) a[--k] = ary[k];
        a.next = function ()
        {
            return nextIndex < ary.length ?
                { value: ary[nextIndex++], done: false } :
                { done: true };
        };
        return a;
    };
}

if (!Array.prototype.includes)
{
    Object.defineProperty(Array.prototype, 'includes', {
        value: function (searchElement, fromIndex)
        {

            // 1. Let O be ? ToObject(this value).
            if (this == null)
            {
                throw new TypeError('"this" is null or not defined');
            }

            var o = Object(this);

            // 2. Let len be ? ToLength(? Get(O, "length")).
            var len = o.length >>> 0;

            // 3. If len is 0, return false.
            if (len === 0)
            {
                return false;
            }

            // 4. Let n be ? ToInteger(fromIndex).
            //    (If fromIndex is undefined, this step produces the value 0.)
            var n = fromIndex | 0;

            // 5. If n ≥ 0, then
            //  a. Let k be n.
            // 6. Else n < 0,
            //  a. Let k be len + n.
            //  b. If k < 0, let k be 0.
            var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

            function sameValueZero(x, y)
            {
                return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y));
            }

            // 7. Repeat, while k < len
            while (k < len)
            {
                // a. Let elementK be the result of ? Get(O, ! ToString(k)).
                // b. If SameValueZero(searchElement, elementK) is true, return true.
                // c. Increase k by 1.
                if (sameValueZero(o[k], searchElement))
                {
                    return true;
                }
                k++;
            }

            // 8. Return false
            return false;
        }
    });
}

/* Disable minification (remove `.min` from URL path) for more info */
(function (undefined)
{
    function ArrayCreate(r)
    {
        if (1 / r == -Infinity && (r = 0), r > Math.pow(2, 32) - 1) throw new RangeError("Invalid array length");
        var n = [];
        return n.length = r, n
    }

    function Call(t, l)
    {
        var n = arguments.length > 2 ? arguments[2] : [];
        if (!1 === IsCallable(t)) throw new TypeError(Object.prototype.toString.call(t) + "is not a function.");
        return t.apply(l, n)
    }

    function CreateDataProperty(e, r, t)
    {
        var a = {
            value: t,
            writable: !0,
            enumerable: !0,
            configurable: !0
        };
        try
        {
            return Object.defineProperty(e, r, a), !0
        } catch (n)
        {
            return !1
        }
    }

    function CreateDataPropertyOrThrow(t, r, o)
    {
        var e = CreateDataProperty(t, r, o);
        if (!e) throw new TypeError("Cannot assign value `" + Object.prototype.toString.call(o) + "` to property `" + Object.prototype.toString.call(r) + "` on object `" + Object.prototype.toString.call(t) + "`");
        return e
    }

    function CreateMethodProperty(e, r, t)
    {
        var a = {
            value: t,
            writable: !0,
            enumerable: !1,
            configurable: !0
        };
        Object.defineProperty(e, r, a)
    }

    function Get(n, t)
    {
        return n[t]
    }

    function HasProperty(n, r)
    {
        return r in n
    }

    function IsArray(r)
    {
        return "[object Array]" === Object.prototype.toString.call(r)
    }

    function IsCallable(n)
    {
        return "function" == typeof n
    }

    function ToInteger(n)
    {
        var i = Number(n);
        return isNaN(i) ? 0 : 1 / i === Infinity || 1 / i == -Infinity || i === Infinity || i === -Infinity ? i : (i < 0 ? -1 : 1) * Math.floor(Math.abs(i))
    }

    function ToLength(n)
    {
        var t = ToInteger(n);
        return t <= 0 ? 0 : Math.min(t, Math.pow(2, 53) - 1)
    }

    function ToObject(e)
    {
        if (null === e || e === undefined) throw TypeError();
        return Object(e)
    }

    function GetV(t, e)
    {
        return ToObject(t)[e]
    }

    function GetMethod(e, n)
    {
        var r = GetV(e, n);
        if (null === r || r === undefined) return undefined;
        if (!1 === IsCallable(r)) throw new TypeError("Method not callable: " + n);
        return r
    }

    function Type(e)
    {
        switch (typeof e)
        {
            case "undefined":
                return "undefined";
            case "boolean":
                return "boolean";
            case "number":
                return "number";
            case "string":
                return "string";
            case "symbol":
                return "symbol";
            default:
                return null === e ? "null" : "Symbol" in this && e instanceof this.Symbol ? "symbol" : "object"
        }
    }

    function EnumerableOwnProperties(e, r)
    {
        for (var t = Object.keys(e), n = [], s = t.length, a = 0; a < s; a++)
        {
            var i = t[a];
            if ("string" === Type(i))
            {
                var u = Object.getOwnPropertyDescriptor(e, i);
                if (u && u.enumerable)
                    if ("key" === r) n.push(i);
                    else
                    {
                        var p = Get(e, i);
                        if ("value" === r) n.push(p);
                        else
                        {
                            var f = [i, p];
                            n.push(f)
                        }
                    }
            }
        }
        return n
    }

    function GetPrototypeFromConstructor(t, o)
    {
        var r = Get(t, "prototype");
        return "object" !== Type(r) && (r = o), r
    }

    function OrdinaryCreateFromConstructor(r, e)
    {
        var t = arguments[2] || {},
            o = GetPrototypeFromConstructor(r, e),
            a = Object.create(o);
        for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && Object.defineProperty(a, n, {
            configurable: !0,
            enumerable: !1,
            writable: !0,
            value: t[n]
        });
        return a
    }

    function IsConstructor(t)
    {
        return "object" === Type(t) && ("function" == typeof t && !!t.prototype)
    }

    function Construct(r)
    {
        var t = arguments.length > 2 ? arguments[2] : r,
            o = arguments.length > 1 ? arguments[1] : [];
        if (!IsConstructor(r)) throw new TypeError("F must be a constructor.");
        if (!IsConstructor(t)) throw new TypeError("newTarget must be a constructor.");
        if (t === r) return new (Function.prototype.bind.apply(r, [null].concat(o)));
        var n = OrdinaryCreateFromConstructor(t, Object.prototype);
        return Call(r, n, o)
    }

    function ArraySpeciesCreate(r, e)
    {
        if (1 / e == -Infinity && (e = 0), !1 === IsArray(r)) return ArrayCreate(e);
        var t = Get(r, "constructor");
        if ("object" === Type(t) && null === (t = "Symbol" in this && "species" in this.Symbol ? Get(t, this.Symbol.species) : undefined) && (t = undefined), t === undefined) return ArrayCreate(e);
        if (!IsConstructor(t)) throw new TypeError("C must be a constructor");
        return Construct(t, [e])
    }

    function OrdinaryToPrimitive(r, t)
    {
        if ("string" === t) var e = ["toString", "valueOf"];
        else e = ["valueOf", "toString"];
        for (var i = 0; i < e.length; ++i)
        {
            var n = e[i],
                a = Get(r, n);
            if (IsCallable(a))
            {
                var o = Call(a, r);
                if ("object" !== Type(o)) return o
            }
        }
        throw new TypeError("Cannot convert to primitive.")
    }

    function ToPrimitive(e)
    {
        var t = arguments.length > 1 ? arguments[1] : undefined;
        if ("object" === Type(e))
        {
            if (arguments.length < 2) var i = "default";
            else t === String ? i = "string" : t === Number && (i = "number");
            var r = "function" == typeof this.Symbol && "symbol" == typeof this.Symbol.toPrimitive ? GetMethod(e, this.Symbol.toPrimitive) : undefined;
            if (r !== undefined)
            {
                var n = Call(r, e, [i]);
                if ("object" !== Type(n)) return n;
                throw new TypeError("Cannot convert exotic object to primitive.")
            }
            return "default" === i && (i = "number"), OrdinaryToPrimitive(e, i)
        }
        return e
    }

    function ToString(t)
    {
        switch (Type(t))
        {
            case "symbol":
                throw new TypeError("Cannot convert a Symbol value to a string");
            case "object":
                return ToString(ToPrimitive(t, "string"));
            default:
                return String(t)
        }
    }
    CreateMethodProperty(Object, "assign", function e(r, t)
    {
        var n = ToObject(r);
        if (1 === arguments.length) return n;
        var a, o, c, l, p = Array.prototype.slice.call(arguments, 1);
        for (a = 0; a < p.length; a++)
        {
            var b = p[a];
            for (b === undefined || null === b ? c = [] : (l = ToObject(b), c = Object.keys(l)), o = 0; o < c.length; o++)
            {
                var i, u = c[o];
                try
                {
                    var y = Object.getOwnPropertyDescriptor(l, u);
                    i = y !== undefined && !0 === y.enumerable
                } catch (O)
                {
                    i = Object.prototype.propertyIsEnumerable.call(l, u)
                }
                if (i)
                {
                    var f = Get(l, u);
                    n[u] = f
                }
            }
        }
        return n
    });
    ! function ()
    {
        var e = {}.toString,
            t = "".split;
        CreateMethodProperty(Object, "entries", function r(n)
        {
            var c = ToObject(n),
                c = "[object String]" == e.call(n) ? t.call(n, "") : Object(n);
            return EnumerableOwnProperties(c, "key+value")
        })
    }();
    ! function ()
    {
        var t = {}.toString,
            e = "".split;
        CreateMethodProperty(Object, "values", function r(n)
        {
            var c = "[object String]" == t.call(n) ? e.call(n, "") : ToObject(n);
            return Object.keys(c).map(function (t)
            {
                return c[t]
            })
        })
    }();
}).call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});