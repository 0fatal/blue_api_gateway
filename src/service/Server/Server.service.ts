import { Server } from '@/model/server/server'
import { Provide } from '@midwayjs/decorator'
import { InjectEntityModel } from '@midwayjs/orm'
import { Repository } from 'typeorm'

@Provide('server_service')
export class ServerService {
    @InjectEntityModel(Server)
    serverModel: Repository<Server>

    async getServer(key: string): Promise<Server> {
        return await this.serverModel.findOne({
            where: {
                key,
            },
        })
    }
}
