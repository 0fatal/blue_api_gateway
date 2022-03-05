import { LoginRequest } from '@/dto/request'
import { Response } from '@/dto/response'
import { AuthService } from '@/service/Auth/Auth.service'
import { Body, Controller, Inject, Post } from '@midwayjs/decorator'
import { Context } from '@midwayjs/koa'
import { Validate } from '@midwayjs/validate'

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
}
