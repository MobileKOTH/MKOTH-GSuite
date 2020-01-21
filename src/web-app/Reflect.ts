import { RoutingRoot, RootQuery } from './Root'
import { RequestGetBase, Helpers } from '../../lib/app-script-router'
import { AdminRequest } from './Admin'

RoutingRoot.reflect = {
    get(request: AdminRequest<RequestGetBase<any>>)
    {
        if (!request.isAdmin)
        {
            return Helpers.returnUnauthorised()
        }
        return Helpers.returnJSON({ routerRoot: RoutingRoot, queryRoot: RootQuery, request: request })
    }
}