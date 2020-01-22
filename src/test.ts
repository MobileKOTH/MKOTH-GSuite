import { EntitySet } from "../lib/spreadsheet-database";

function toHexString(byteArray: number[])
{
    return Array.from(byteArray, function (byte)
    {
        return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('')
}

export function test()
{
    type TestEntity = { date: Date, value: number, boolean: boolean, string: string, object: any }

    const es = new EntitySet<TestEntity>({ spreadSheet: SpreadsheetApp.getActive(), tableName: "Test" })


    const testSet: TestEntity[] = []


    for (let index = 0; index < 1000; index++)
    {
        testSet.push({ date: new Date(), value: index, boolean: index % 2 == 0, string: "test" + index, object: [1, 2, 3, 4] })
    }

    es.updateAll(testSet);

    const values = es.loadAll()

    Logger.log(JSON.stringify(values))
}
