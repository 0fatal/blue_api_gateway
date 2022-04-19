import { Response } from '@/dto/response'
import { CustomException } from '@/exception'
import { IMiddleware } from '@midwayjs/core'
import { Middleware } from '@midwayjs/decorator'
import { Context, NextFunction } from '@midwayjs/koa'

// TODO handle Error
@Middleware()
export class ExceptionMiddleware implements IMiddleware<Context, NextFunction> {
    resolve() {
        return async (ctx: Context, next: NextFunction) => {
            let res: any
            try {
                res = await next()
            } catch (error) {
                if (error instanceof CustomException) {
                    const err = error as CustomException
                    ctx.logger.error(err.toString())
                    console.log('httpCode', err.httpCode)
                    ctx.status = err.httpCode
                    if (err.payload instanceof Response) {
                        console.log(err)
                        return err.payload
                    }
                    return {
                        code: err.errCode,
                        msg: err.err,
                        data: {},
                    }
                }
                throw error
            }
            return res
        }
    }
}
