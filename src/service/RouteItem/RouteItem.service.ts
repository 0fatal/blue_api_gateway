import { Provide } from '@midwayjs/decorator'
import { InjectEntityModel } from '@midwayjs/orm'
import { Repository } from 'typeorm'
import { RouteItem } from '../../model/routerItem/routeItem'

@Provide('route_item_service')
export class RouteItemService {
    @InjectEntityModel(RouteItem)
    routeItemModel: Repository<RouteItem>

    async getRouteItem(father: string, location: string, method: string) {
        return await this.routeItemModel.findOne({
            where: {
                father: father,
                method: method,
                location: location,
            },
        })
    }
}
