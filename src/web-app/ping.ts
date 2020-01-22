import { RequestGetBase, Helpers, RequestPostBase } from '../../lib/app-script-router'
import { RootQuery } from './root'

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
