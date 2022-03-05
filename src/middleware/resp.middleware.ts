import { AuthResp, Response, ResponseType } from '@/dto/response'
import { AuthService } from '@/service/Auth/Auth.service'
import { IMiddleware } from '@midwayjs/core'
import { Config, Inject, Middleware } from '@midwayjs/decorator'
import { Context, NextFunction } from '@midwayjs/koa'
import { networkInterfaces } from 'os'

@Middleware()
export class RespMiddleware implements IMiddleware<Context, NextFunction> {
    resolve() {
        return async (ctx: Context, next: NextFunction) => {
            const resp = await next()
            if (resp instanceof Response) {
                const b = resp as Response<any>
                if (b.type === ResponseType.JSON) {
                    return b.JSON
                }
                if (b.type === ResponseType.HTML) {
                    return b.render
                }
                if (b.type === ResponseType.REDIRECT) {
                    ctx.redirect(b.redirect.url)
                }
                if (b.type === ResponseType.DIRECT) {
                    return
                }
            }
            return resp
        }
    }
}
