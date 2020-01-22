/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. 
 *  MIT License

    Copyright (c) 2015 - present Microsoft Corporation

    All rights reserved.

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
 *--------------------------------------------------------------------------------------------*/

/**
 * A value that is resolved synchronously when it is first needed.
 */
export interface Lazy<T>
{

    hasValue(): boolean;


    getValue(): T;


    map<R>(f: (x: T) => R): Lazy<R>;
}

export class Lazy<T> {

    private _didRun: boolean = false;
    private _value?: T;
    private _error: any;

    constructor(
        private readonly executor: () => T,
    ) { }

	/**
	 * True if the lazy value has been resolved.
	 */
    hasValue() { return this._didRun; }

	/**
	 * Get the wrapped value.
	 *
	 * This will force evaluation of the lazy value if it has not been resolved yet. Lazy values are only
	 * resolved once. `getValue` will re-throw exceptions that are hit while resolving the value
	 */
    getValue(): T
    {
        if (!this._didRun)
        {
            try
            {
                this._value = this.executor();
            } catch (err)
            {
                this._error = err;
            } finally
            {
                this._didRun = true;
            }
        }
        if (this._error)
        {
            throw this._error;
        }
        return this._value!;
    }

	/**
	 * Get the wrapped value without forcing evaluation.
	 */
    get rawValue(): T | undefined { return this._value; }

	/**
	 * Create a new lazy value that is the result of applying `f` to the wrapped value.
	 *
	 * This does not force the evaluation of the current lazy value.
	 */
    map<R>(f: (x: T) => R): Lazy<R>
    {
        return new Lazy<R>(() => f(this.getValue()));
    }
}
