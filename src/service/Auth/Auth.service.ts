import { AuthResp } from '@/dto/response'
import { AccessToken } from '@/model/accessToken/accessToken'
import { User } from '@/model/user/user'
import { modelFromJson } from '@/utils/base'
import { Config, Inject, Provide } from '@midwayjs/decorator'
import { JwtService } from '@midwayjs/jwt'
import { InjectEntityModel } from '@midwayjs/orm'
import { randomUUID } from 'crypto'
import { Context } from 'koa'
import { MoreThan, Repository } from 'typeorm'

@Provide('auth_service')
export class AuthService {
    @InjectEntityModel(AccessToken)
    accessTokenModel: Repository<AccessToken>

    @InjectEntityModel(User)
    userModel: Repository<User>

    @Inject()
    jwt: JwtService

    @Config('authService.TOKEN_EXPIRE')
    tokenExpire: number

    @Config('authService.AUTH_FLAG')
    AUTH_FLAG: string

    async deleteToken(token: string): Promise<boolean> {
        if (token === '') {
            throw new Error('invalid token')
        }

        return (await (await this.accessTokenModel.delete(token)).affected) > 0
    }

    async lookUpAccessToken(
        tokenStr: string
    ): Promise<AccessToken | undefined> {
        if (tokenStr === '') {
            return undefined
        }

        return await this.accessTokenModel.findOne({
            where: {
                accessToken: tokenStr,
                expiredTime: MoreThan(new Date()),
            },
        })
    }

    async findUserByStaffIDAndPassword(
        staffID: string,
        password: string
    ): Promise<User | undefined> {
        return await this.userModel.findOne({
            where: {
                staffID,
                password,
            },
        })
    }

    async createAccessTokenByUser(
        user: User,
        ua: string,
        ip: string
    ): Promise<string> {
        const token = randomUUID()
        const at = this.accessTokenModel.create({
            userAgent: ua,
            staffID: user.staffID,
            ip: ip,
            accessToken: token,
            expiredTime: new Date(Date.now() + this.tokenExpire),
        })

        await this.accessTokenModel.insert(at)

        return token
    }

    async createAccessTokenByStaffID(
        staffID: string,
        ua: string,
        ip: string
    ): Promise<string> {
        const token = randomUUID()
        const at = this.accessTokenModel.create({
            userAgent: ua,
            staffID: staffID,
            ip: ip,
            accessToken: token,
            expiredTime: new Date(Date.now() + this.tokenExpire),
        })

        await this.accessTokenModel.insert(at)

        return token
    }

    async getTokenInfo(ctx: Context) {
        const auth = this.getAuthStatus(ctx)
        if (!auth || !auth.found) {
            return (ctx.body = {
                error: 0,
                msg: 'unauthorized',
                data: {
                    accessToken: '',
                },
            })
        }

        ctx.body = {
            error: 0,
            msg: 'success',
            data: {
                isValid: 1,
                accessToken: auth.token.accessToken,
                expiredTime: auth.token.expiredTime,
                staffId: auth.token.staffID,
            },
        }
    }

    getAuthStatus(ctx: Context): AuthResp {
        const auth = modelFromJson<AuthResp>(ctx.getAttr(this.AUTH_FLAG))
        if (!auth) {
            return AuthResp.makeAuthNotFound()
        }
        return auth as AuthResp
    }
}
