import { InjectEntityModel } from '@midwayjs/orm'
import { Repository } from 'typeorm'
import { RouteItem } from '../../model/routerItem/routeItem'

export class RouteItemService {
    @InjectEntityModel(RouteItem)
    routeItemModel: Repository<RouteItem>

    async getRouteItem(location: string, method: string) {
        return await this.routeItemModel.findOne({
            where: {
                method: method,
                location: location,
            },
        })
    }
}
