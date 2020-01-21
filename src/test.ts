function toHexString(byteArray: number[])
{
    return Array.from(byteArray, function (byte)
    {
        return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('')
}

export function test()
{
    Logger.log(toHexString(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_1, [Math.random(), Math.random(), Math.random()].join(""))))
}