import { CustomException } from '@/exception'
import { AuthService } from '@/service/Auth/Auth.service'
import { ServerService } from '@/service/Server/Server.service'
import { ClassPropertyWithExcludeExtend } from '@/types'
import { defineProperties } from '@/utils/base'
import { Inject } from '@midwayjs/decorator'
import { Context } from '@midwayjs/koa'
import { EntityModel } from '@midwayjs/orm'
import request = require('superagent')
import { Column, Index } from 'typeorm'
import { BaseEntityModel } from '../BaseEntityModel'

// http://server.addr/father/location
@Index(['method', 'location', 'father', 'remote'], { unique: true })
@EntityModel('router_item')
export class RouteItem extends BaseEntityModel {
    // 对外暴露的path
    @Column({ comment: '路径', length: 255, type: 'varchar', nullable: false })
    location: string

    @Column({ comment: '方法', length: '6', type: 'varchar', nullable: false })
    method: string

    @Column({
        comment: '是否需要登录  0:否/1:是',
        default: 0,
        type: 'tinyint',
    })
    needAuthorized: boolean

    @Column({ comment: '是否需要回调 0:否/1:是', default: 0, type: 'tinyint' })
    needRedirect: boolean

    @Column({
        array: true,
        type: 'varchar',
        length: 20,
        comment: '需要转发的请求头',
        default: [],
    })
    DirectThroughRequestHeaders: string[]

    @Column({
        array: true,
        type: 'varchar',
        length: 20,
        comment: '需要转发的响应头',
        default: [],
    })
    DirectThroughResponseHeaders: string[]

    @Column({
        comment: '远端路径',
        length: 255,
        type: 'varchar',
        nullable: false,
    })
    remote: string

    @Column({
        comment: '从属api',
        length: 20,
        type: 'varchar',
        nullable: false,
    })
    father: string

    @Inject()
    serverService: ServerService

    @Inject()
    authService: AuthService

    async remoteUrl(): Promise<URL> {
        // return ''
        const server = await this.serverService.getServer(this.father)
        if (!server) {
            throw CustomException.Make('BAD_REQUEST', 'can not find server')
        }
        const u = new URL(server.addr)
        u.pathname = this.remote
        return u
    }

    constructor(
        props: ClassPropertyWithExcludeExtend<RouteItem, BaseEntityModel>
    ) {
        super()
        defineProperties(this, props)
    }

    makeNewRemoteRequest(): request.SuperAgentRequest {
        const req = request(this.method, this.remoteUrl().toString())
        return req
    }

    checkScope(ctx: Context) {
        if (this.needAuthorized) {
            const authStatus = this.authService.getAuthStatus(ctx)
            if (!authStatus.isValid()) {
                throw CustomException.Make('UNAUTHORIZED')
            }
        }
    }
}
