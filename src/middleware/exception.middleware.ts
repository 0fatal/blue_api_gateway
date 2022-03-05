import { Response } from '@/dto/response'
import { CustomException } from '@/exception'
import { IMiddleware } from '@midwayjs/core'
import { Middleware } from '@midwayjs/decorator'
import { Context, NextFunction } from '@midwayjs/koa'

@Middleware()
export class ExceptionMiddleware implements IMiddleware<Context, NextFunction> {
    resolve() {
        return async (ctx: Context, next: NextFunction) => {
            try {
                await next()
            } catch (error) {
                if (error instanceof CustomException) {
                    const err = error as CustomException
                    ctx.status = err.httpCode

                    if (err.payload instanceof Response) {
                        return err.payload
                    }
                    return {
                        code: err.errCode,
                        msg: err.err,
                        data: {},
                    }
                }
            }
        }
    }
}
