import { CustomException } from '@/exception'
import { AuthService } from '@/service/Auth/Auth.service'
import { ServerService } from '@/service/Server/Server'
import { ClassProperty } from '@/types'
import { defineProperties } from '@/utils/base'
import { Inject } from '@midwayjs/decorator'
import { Context } from '@midwayjs/koa'
import { EntityModel } from '@midwayjs/orm'
import request = require('superagent')
import { Column } from 'typeorm'

// http://server.addr/father/location
@EntityModel('router_item')
export class RouteItem {
    // 对外暴露的path
    @Column({ comment: '路径' })
    location: string

    @Column({ comment: '方法' })
    method: string

    @Column({ comment: '是否需要登录' })
    needAuthorized: boolean

    @Column({ comment: '是否需要回调' })
    needRedirect: boolean

    @Column({
        array: true,
        type: 'varchar',
        length: 20,
        comment: 'DirectThroughRequestHeaders',
    })
    DirectThroughRequestHeaders: string[]

    @Column({
        array: true,
        type: 'varchar',
        length: 20,
        comment: 'DirectThroughResponseHeaders',
    })
    DirectThroughResponseHeaders: string[]

    @Column({ comment: '远端路径' })
    remote: string

    @Column({ comment: '从属api' })
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

    constructor(props: ClassProperty<RouteItem>) {
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
