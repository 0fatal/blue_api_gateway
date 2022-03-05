import { AuthResp } from '@/dto/response'
import { AuthService } from '@/service/Auth/Auth.service'
import { IMiddleware } from '@midwayjs/core'
import { Config, Inject, Middleware } from '@midwayjs/decorator'
import { Context, NextFunction } from '@midwayjs/koa'

@Middleware()
export class AuthMiddleware implements IMiddleware<Context, NextFunction> {
    @Config('authService.AUTH_FLAG')
    AUTH_FLAG: string

    @Inject()
    authService: AuthService

    resolve() {
        return async (ctx: Context, next: NextFunction) => {
            const authorization: string = ctx.get('Authorization')
            const staffID: string = ctx.get('AssignTo').trim()

            const authArr = authorization.split(' ')

            if (authArr.length !== 2 || staffID === '') {
                ctx.setAttr(this.AUTH_FLAG, null)
                return
            }

            const tokenStr = authArr[1]

            const token = await this.authService.lookUpAccessToken(
                staffID,
                tokenStr
            )
            if (!token.isValid()) {
                ctx.setAttr(this.AUTH_FLAG, null)
            }
            ctx.setAttr(this.AUTH_FLAG, AuthResp.makeSuccessAuth(token))
        }
    }
}
