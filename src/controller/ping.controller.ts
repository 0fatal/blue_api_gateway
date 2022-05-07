import { RouteItemService } from '@/service/RouteItem/RouteItem.service'
import { Controller, Get, Inject, Provide } from '@midwayjs/decorator'
import { Context } from '@midwayjs/koa'

@Provide()
@Controller('/external')
export class PingController {
    @Get('/ping')
    async ping() {
        return {
            success: true,
            message: 'pong',
        }
    }

    @Inject()
    ctx: Context

    @Inject()
    routeItemService: RouteItemService

    @Get('/routes')
    async routes() {
        const routes = await this.routeItemService.getRouteItemList()

        const _routes = {}

        routes.forEach(route => {
            if (!(route.father in _routes)) {
                _routes[route.father] = []
            }
            _routes[route.father].push(route)
        })

        console.log(_routes['class'])

        await this.ctx.render('RouterItem.view.njk', { routes: _routes })
    }
}
