import { RequestPostBase, RequestGetBase, Router, Helpers } from "../app-script-router";

export const RoutingRoot: Router<any, any> =
{
    get(request: RequestGetBase<any>)
    {
        const subHandler = RootQuery[Object.keys(request.parameter).filter(x => RootQuery[x])[0]];
        if (subHandler && subHandler.get)
        {
            return subHandler.get(request);
        }
        else
        {
            return Helpers.returnEmpty(request);
        }
    },
    post(request: RequestPostBase<any>)
    {
        const subHandler = RootQuery[Object.keys(request.parameter).filter(x => RootQuery[x])[0]];
        if (subHandler && subHandler.post)
        {
            return subHandler.post(request);
        }
        else
        {
            return Helpers.returnEmpty(request);
        }
    }
}

export const RootQuery: { [key: string]: Router<any, any> } = {} 