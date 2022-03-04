import { InjectEntityModel } from '@midwayjs/orm'
import superagent = require('superagent')
import { Repository } from 'typeorm'
import { RouteItem } from '../../model/routerItem/routeItem'

export class RouteItemService {
    @InjectEntityModel(RouteItem)
    routeItemModel: Repository<RouteItem>

    async getRouteItem(father, location: string, method: string) {
        return await this.routeItemModel.findOne({
            where: {
                father: father,
                method: method,
                location: location,
            },
        })
    }
}
