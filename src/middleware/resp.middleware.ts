import { Response, ResponseType } from '@/dto/response'
import { IMiddleware } from '@midwayjs/core'
import { Middleware } from '@midwayjs/decorator'
import { Context, NextFunction } from '@midwayjs/koa'

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
