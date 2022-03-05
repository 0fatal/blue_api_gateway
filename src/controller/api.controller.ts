import { Response, ServiceResp } from '@/dto/response'
import { CustomException } from '@/exception'
import { RouteItem } from '@/model/routerItem/routeItem'
import { RouteItemService } from '@/service/RouteItem/RouteItem'
import { Inject, Controller, All } from '@midwayjs/decorator'
import { Context } from '@midwayjs/koa'
import request = require('superagent')

@Controller('/v1')
export class APIController {
    @Inject()
    ctx: Context

    @Inject()
    routeItemService: RouteItemService

    @All('/*')
    async forwardRequest() {
        const path = this.ctx.path
        const pathSplit = path.split('/', 3)
        const method = this.ctx.method

        if (pathSplit.length !== 3) {
            throw CustomException.Make('NOT_FOUND')
        }
        const father = pathSplit[1]
        const location = pathSplit[2]

        const rt = await this.routeItemService.getRouteItem(
            father,
            location,
            method
        )

        if (!rt) {
            throw CustomException.Make('NOT_FOUND')
        }

        rt.checkScope(this.ctx)

        const req = rt.makeNewRemoteRequest()

        const setRequestHeader = (
            ctx: Context,
            req: request.Request,
            rt: RouteItem
        ) => {
            for (const headerName of rt.DirectThroughRequestHeaders) {
                const headerValue = ctx.header[headerName]
                req.set(headerName, headerValue as string)
            }
        }

        const copyHeaderFromResp = (
            ctx: Context,
            resp: request.Response,
            rt: RouteItem
        ) => {
            for (const headerName of rt.DirectThroughResponseHeaders) {
                const headerValue = resp.get(headerName)
                if (headerName) {
                    ctx.header[headerName] = headerValue
                }
            }
        }

        const setBody = (ctx: Context, req: request.Request, rt: RouteItem) => {
            const body = ctx.request.body
            if (body) {
                req.send(body)
            }
        }

        setRequestHeader(this.ctx, req, rt)
        setBody(this.ctx, req, rt)
        const resp = await req
        if (resp.error) {
            throw CustomException.Make('SERVER_ERROR', resp.error.text)
        }

        const respBody = resp.body as ServiceResp
        if (resp.statusCode !== 200 && respBody.data) {
            const r = Response.MakeJSONErrorWithData(
                resp.statusCode,
                respBody.code,
                respBody.msg,
                respBody.data
            )
            throw new CustomException({
                httpCode: resp.statusCode,
                payload: r,
            })
        }

        if (resp.statusCode !== 200 && !respBody.data) {
            const r = Response.MakeJSONError(
                resp.statusCode,
                respBody.code,
                respBody.msg
            )
            throw new CustomException({
                httpCode: resp.statusCode,
                payload: r,
            })
        }

        if (rt.needRedirect && respBody.redirect) {
            const r = Response.MakeRedirect(respBody.redirect)
            throw new CustomException({
                httpCode: resp.statusCode,
                payload: r,
            })
        }

        const r = Response.MakeJSONSuccess(respBody.data)
        copyHeaderFromResp(this.ctx, resp, rt)

        return r.JSON
    }
}
