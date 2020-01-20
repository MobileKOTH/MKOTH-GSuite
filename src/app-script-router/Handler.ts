import { Routable, RequestGetBase, WebAppOutput, RequestPostBase, Router } from "./types"
import { Helpers } from "./Helpers"

export class Handler
{
    constructor(
        private readonly routingRoot: Routable
    ) { }

    handleGet(request: RequestGetBase<any>): WebAppOutput
    {
        return this.handle(request, router => router.get)
    }

    handlePost(request: RequestPostBase<any>): WebAppOutput
    {
        return this.handle(request, router => router.post)
    }

    private handle(request: RequestGetBase<any> | RequestPostBase<any>, selector: (router: Router<any, any>) => Function | undefined): WebAppOutput
    {
        const router = this.traversePath(request.pathInfo || "")

        if (router)
        {
            const selected = selector(router)
            if (selected)
            {
                try
                {
                    return selected(request)
                } catch (error)
                {
                    return Helpers.returnError(error, request)
                }

            }
        }
        return Helpers.returnEmpty(request)
    }

    private traversePath(path: string): Router<any, any> | undefined
    {
        if (path === "")
        {
            return this.routingRoot as Router<any, any> | undefined
        }

        const paths = path.split("/")
        const controllers = this.routingRoot

        let routers = controllers

        while (paths.length > 0)
        {
            const current = paths.shift() as string
            routers = routers[Object.getOwnPropertyNames(routers).filter(x => x.toLowerCase() === current.toLowerCase())[0]] as Routable

            if (!routers)
            {
                break;
            }
        }
        return routers as Router<any, any> | undefined
    }
}