import { RootQuery } from './Root'
import { RequestGetBase, Helpers, RequestPostBase } from '../../lib/app-script-router'

RootQuery.ping =
{
    get(request: RequestGetBase<any>)
    {
        return Helpers.returnJSON({ ...request, status: "ok", runTime: Date.now() - InstanceTime })
    },
    post(request: RequestPostBase<any>)
    {
        return Helpers.returnJSON({ ...request, status: "ok", runTime: Date.now() - InstanceTime })
    }
}
