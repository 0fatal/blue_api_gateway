import { AuthResp } from '@/dto/response'
import { AccessToken } from '@/model/accessToken/accessToken'
import { User } from '@/model/user/user'
import { Config, Provide } from '@midwayjs/decorator'
import { InjectEntityModel } from '@midwayjs/orm'
import { randomUUID } from 'crypto'
import { Context } from 'koa'
import { MoreThan, Repository } from 'typeorm'
import { CustomException } from '@/exception'
import MD5 from 'crypto-js/md5'

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
        const hash = MD5(password + 'blue_api_gateway').toString()
        return await this.userModel.findOne({
            where: {
                staffID,
                password: hash,
            },
        })
    }

    async registerUser(
        staffID: string,
        password: string,
        nickname: string
    ): Promise<boolean> {
        const hash = MD5(password + 'blue_api_gateway').toString()
        password = hash
        const user = new User({
            staffID,
            password,
            nickname,
        })
        try {
            await this.userModel.insert(user)
        } catch (error) {
            console.log(error)
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
        const auth = ctx.getAttr(this.AUTH_FLAG)
        if (!auth) {
            return AuthResp.makeAuthNotFound()
        }
        return auth as AuthResp
    }
}
