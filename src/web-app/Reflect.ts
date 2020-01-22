import { RequestGetBase, Helpers } from '../../lib/app-script-router'
import { RoutingRoot, RootQuery } from './root'
import { AdminRequest } from './admin'

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
