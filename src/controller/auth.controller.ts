import { LoginRequest } from '@/dto/request'
import { Response } from '@/dto/response'
import { CustomException } from '@/exception'
import { AuthService } from '@/service/Auth/Auth.service'
import { Body, Controller, Inject, Post, Provide } from '@midwayjs/decorator'
import { Context } from '@midwayjs/koa'
import { Validate } from '@midwayjs/validate'

@Provide()
@Controller('/v1/authorization')
export class AuthController {
    @Inject()
    authService: AuthService

    @Inject()
    ctx: Context

    @Post('/login')
    @Validate()
    async login(@Body() loginRequest: LoginRequest) {
        const ua = this.ctx.get('user-agent')
        const ip = this.ctx.ip

        const user = await this.authService.findUserByStaffIDAndPassword(
            loginRequest.staffID,
            loginRequest.password
        )

        if (!user) {
            return Response.MakeJSONError(200, -1, '用户名或密码错误')
        }

        if (!user.checkIfAllowLogin()) {
            throw CustomException.Make('FORBIDDEN', 'not allow login')
        }

        const token = await this.authService.createAccessTokenByUser(
            user,
            ua,
            ip
        )

        return Response.MakeJSONSuccess({
            authorize: true,
            accessToken: token,
        })
    }

    @Post('/validate')
    @Validate()
    async getTokenInfo() {
        const auth = this.authService.getAuthStatus(this.ctx)
        console.log(auth)
        if (!auth || !auth.found) {
            return Response.MakeJSONSuccess(
                {
                    accessToken: '',
                },
                'unauthorized'
            )
        }

        return Response.MakeJSONSuccess({
            accessToken: auth.token.accessToken,
            expiredTime: auth.token.expiredTime,
            staffId: auth.token.staffID,
        })
    }
}
