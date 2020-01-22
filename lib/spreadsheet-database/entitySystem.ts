import { loadEntities } from "./loader";
import { updateEntities } from "./updater";
import { Lazy } from "./lazy";


type EntitySetOptions = {
    spreadSheet: GoogleAppsScript.Spreadsheet.Spreadsheet
    tableName: string
}

export interface IEntity
{
    [key: string]: number | string | Date | boolean
}

export class EntitySet<T extends IEntity>
{
    public readonly spreadSheet: GoogleAppsScript.Spreadsheet.Spreadsheet;
    public readonly tableName: string;

    private loaded: Lazy<T[]>

    constructor(options: EntitySetOptions)
    {
        this.spreadSheet = options.spreadSheet;
        this.tableName = options.tableName;
        this.loaded = new Lazy(() => loadEntities<T>(this.spreadSheet, this.tableName))
    }

    loadAll()
    {
        return this.loaded.getValue()
    }

    updateAll(entities: T[])
    {
        this.loaded = new Lazy(() => loadEntities<T>(this.spreadSheet, this.tableName))
        updateEntities(this.spreadSheet, this.tableName, entities)
    }
}
