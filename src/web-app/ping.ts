import { RootQuery } from './root'
import { RequestGetBase, Helpers, RequestPostBase } from '../app-script-router'

RootQuery.ping =
{
    get(request: RequestGetBase<any>)
    {
        return Helpers.returnJSON({ ...request, status: "ok" })
    },
    post(request: RequestPostBase<any>)
    {
        return Helpers.returnJSON({ ...request, status: "ok" })
    }
}
