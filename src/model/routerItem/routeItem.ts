import { CustomException } from '@/exception'
import { ServerService } from '@/service/Server/Server'
import { ClassProperty } from '@/types'
import { defineProperties } from '@/utils/base'
import { Inject } from '@midwayjs/decorator'
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

    @Column({ comment: '远端路径' })
    remote: string

    @Column({ comment: '从属api' })
    father: string

    @Inject()
    serverService: ServerService

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

    async makeNewRemoteRequest(): Promise<request.Response> {
        const req = request((await this.remoteUrl()).toString())
        req.method = this.method
        return req
    }
}
