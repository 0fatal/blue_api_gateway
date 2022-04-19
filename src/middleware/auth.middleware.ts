import { AuthResp } from '@/dto/response'
import { AuthService } from '@/service/Auth/Auth.service'
import { IMiddleware } from '@midwayjs/core'
import { Config, Middleware } from '@midwayjs/decorator'
import { Context, NextFunction } from '@midwayjs/koa'

@Middleware()
export class AuthMiddleware implements IMiddleware<Context, NextFunction> {
    @Config('authService.AUTH_FLAG')
    AUTH_FLAG: string

    resolve() {
        return async (ctx: Context, next: NextFunction) => {
            const authService = await ctx.requestContext.getAsync<AuthService>(
                AuthService
            )
            const authorization: string = ctx.get('Authorization').trim()
            const staffID: string = ctx.get('AssignTo').trim()

            const authArr = authorization.split(' ')

            if (authArr.length !== 2 || staffID === '') {
                ctx.setAttr(this.AUTH_FLAG, null)
                return await next()
            }

            const tokenStr = authArr[1]

            const token = await authService.lookUpAccessToken(staffID, tokenStr)
            if (!token.isValid()) {
                ctx.setAttr(this.AUTH_FLAG, null)
            }

            console.log('token', token, this.AUTH_FLAG)
            ctx.setAttr(this.AUTH_FLAG, AuthResp.makeSuccessAuth(token))
            ctx.staffID = token.staffID
            return await next()
        }
    }
}
