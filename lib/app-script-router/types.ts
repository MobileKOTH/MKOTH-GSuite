export type Routable = {
    [key: string]: Routable | RequestGetResponse<any> | RequestPostResponse<any> | undefined
    get?: RequestGetResponse<any>
    post?: RequestPostResponse<any>
}

export type RequestGetBase<T> = {
    parameter: T
    queryString?: string
    pathInfo?: string
}

export type RequestPostBase<T> = RequestGetBase<T> & {
    postData: {
        contents: string
        type: string
    }
}

export type WebAppOutput = GoogleAppsScript.Content.TextOutput | GoogleAppsScript.HTML.HtmlOutput

type RequestGetResponse<T> = (request: RequestGetBase<T>) => WebAppOutput
type RequestPostResponse<T> = (request: RequestPostBase<T>) => WebAppOutput

export type Router<T, U> = {
    get?: RequestGetResponse<T>
    post?: RequestPostResponse<U>
}
