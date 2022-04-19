import { Response, ResponseType, ServiceResp } from '@/dto/response'
import { CustomException } from '@/exception'
import { RouteItem } from '@/model/routerItem/routeItem'
import { RouteItemService } from '@/service/RouteItem/RouteItem.service'
import { Inject, Controller, All, Provide } from '@midwayjs/decorator'
import { Context } from '@midwayjs/koa'
import request = require('superagent')

@Provide()
@Controller('/v1')
export class APIController {
    @Inject()
    ctx: Context

    @Inject()
    routeItemService: RouteItemService

    @All('/*')
    async forwardRequest() {
        const path = this.ctx.path
        const pathSplit = path.split('/')
        const method = this.ctx.method

        if (pathSplit.length < 4) {
            throw CustomException.Make('NOT_FOUND')
        }
        const father = pathSplit[2]
        const location = '/' + pathSplit.slice(3).join('/')
        console.log(father, location)

        const rt = await this.routeItemService.getRouteItem(
            father,
            location,
            method
        )

        if (!rt) {
            throw CustomException.Make('NOT_FOUND')
        }

        this.routeItemService.checkScope(rt)

        const req = (await this.routeItemService.makeNewRemoteRequest(rt))()

        const setRequestHeader = (
            ctx: Context,
            req: request.Request,
            rt: RouteItem
        ) => {
            if (rt.needAuthorized) {
                req.set('staffID', ctx.staffID)
            }
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
            const query = ctx.request.query
            if (body) {
                req.send(body)
            }
            if (query) {
                req.query(query)
            }
        }

        setRequestHeader(this.ctx, req, rt)
        setBody(this.ctx, req, rt)
        const resp = await req
        console.log(resp.body)
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

        let r: Response<ResponseType.JSON>

        if (respBody.code === 0) {
            r = Response.MakeJSONSuccess(respBody.data)
        } else {
            r = Response.MakeJSONErrorWithData(
                200,
                respBody.code,
                respBody.msg,
                respBody.data
            )
        }

        copyHeaderFromResp(this.ctx, resp, rt)

        return r.JSON
    }
}
