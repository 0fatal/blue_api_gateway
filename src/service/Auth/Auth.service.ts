import { AuthResp } from '@/dto/response'
import { AccessToken } from '@/model/accessToken/accessToken'
import { User } from '@/model/user/user'
import { modelFromJson } from '@/utils/base'
import { Config, Provide } from '@midwayjs/decorator'
import { InjectEntityModel } from '@midwayjs/orm'
import { randomUUID } from 'crypto'
import { Context } from 'koa'
import { MoreThan, Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { CustomException } from '@/exception'

@Provide('auth_service')
export class AuthService {
    @InjectEntityModel(AccessToken)
    accessTokenModel: Repository<AccessToken>

    @InjectEntityModel(User)
    userModel: Repository<User>

    @Config('authService.TOKEN_EXPIRE')
    tokenExpire: number

    @Config('authService.AUTH_FLAG')
    AUTH_FLAG: string

    async deleteToken(staffID: string, token: string): Promise<boolean> {
        if (token === '' || staffID === '') {
            throw new Error('invalid token or staffID')
        }

        return (
            (
                await this.accessTokenModel.softDelete({
                    accessToken: token,
                    staffID: staffID,
                })
            ).affected > 0
        )
    }

    async lookUpAccessToken(
        staffID: string,
        tokenStr: string
    ): Promise<AccessToken | undefined> {
        if (tokenStr === '') {
            return undefined
        }

        return await this.accessTokenModel.findOne({
            where: {
                staffID: staffID,
                accessToken: tokenStr,
                expiredTime: MoreThan(new Date()),
            },
        })
    }

    async findUserByStaffIDAndPassword(
        staffID: string,
        password: string
    ): Promise<User | undefined> {
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)

        return await this.userModel.findOne({
            where: {
                staffID,
                password: hash,
            },
        })
    }

    async registerUser(user: User): Promise<boolean> {
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(user.password, salt)
        user.password = hash
        try {
            await this.userModel.insert(user)
        } catch (error) {
            throw new CustomException({
                httpCode: 400,
                err: 'user has been registered',
                errCode: -1,
            })
        }
        return true
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

    getAuthStatus(ctx: Context): AuthResp {
        const auth = modelFromJson<AuthResp>(ctx.getAttr(this.AUTH_FLAG))
        if (!auth) {
            return AuthResp.makeAuthNotFound()
        }
        return auth as AuthResp
    }
}
