import { CustomException } from '@/exception'
import { Inject, Provide } from '@midwayjs/decorator'
import { Context } from '@midwayjs/koa'
import { InjectEntityModel } from '@midwayjs/orm'
import request from 'superagent'
import { Repository } from 'typeorm'
import { RouteItem } from '../../model/routerItem/routeItem'
import { AuthService } from '../Auth/Auth.service'
import { ServerService } from '../Server/Server.service'

@Provide('route_item_service')
export class RouteItemService {
    @InjectEntityModel(RouteItem)
    routeItemModel: Repository<RouteItem>

    @Inject()
    authService: AuthService

    @Inject()
    serverService: ServerService

    async getRouteItem(father: string, location: string, method: string) {
        return await this.routeItemModel.findOne({
            where: {
                father: father,
                method: method,
                location: location,
            },
        })
    }

    async getRemoteUrl(routeItem: RouteItem) {
        const server = await this.serverService.getServer(routeItem.father)
        console.log(server.addr)
        if (!server) {
            throw CustomException.Make('BAD_REQUEST', 'can not find server')
        }
        const u = new URL(server.addr)
        u.pathname = `/${routeItem.father}${routeItem.remote}`
        return u
    }

    async makeNewRemoteRequest(routeItem: RouteItem) {
        const url = await this.getRemoteUrl(routeItem)
        const req = () => {
            return request(routeItem.method, url.toString())
        }
        return req
    }

    @Inject()
    ctx: Context

    checkScope(routeItem: RouteItem) {
        if (routeItem.needAuthorized) {
            const authStatus = this.authService.getAuthStatus(this.ctx)
            console.log(authStatus.isValid())
            if (!authStatus.isValid()) {
                throw CustomException.Make('UNAUTHORIZED')
            }
        }
    }
}
