import { RequestGetBase, Helpers, RequestPostBase } from '../../lib/app-script-router'
import { RootQuery } from './root'

type GZipRequest = {
    gzip: string
};

type UnGZipRequest = {
    ungzip: string
};

RootQuery.gzip = {
    get(request: RequestGetBase<GZipRequest>)
    {
        return ContentService.createTextOutput(Utilities.base64Encode(Utilities.gzip(Utilities.newBlob(request.parameter.gzip)).getBytes()))
    },
    post(request: RequestPostBase<GZipRequest>)
    {
        return ContentService.createTextOutput(Utilities.base64Encode(Utilities.gzip(Utilities.newBlob(request.postData.contents)).getBytes()))
    },
}

RootQuery.ungzip = {
    get(request: RequestGetBase<UnGZipRequest>)
    {
        return ContentService.createTextOutput(Utilities.ungzip(Utilities.newBlob(Utilities.base64Decode(request.parameter.ungzip), "application/x-gzip")).getDataAsString())
    },
    post(request: RequestPostBase<UnGZipRequest>)
    {
        return ContentService.createTextOutput(Utilities.ungzip(Utilities.newBlob(Utilities.base64Decode(request.postData.contents), "application/x-gzip")).getDataAsString())
    },
}