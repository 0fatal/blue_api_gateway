import { Server } from '@/model/server/server'
import { InjectEntityModel } from '@midwayjs/orm'
import { Repository } from 'typeorm'

export class ServerService {
    @InjectEntityModel(Server)
    serverModel: Repository<Server>

    async getServer(key: string): Promise<Server> {
        return await this.serverModel.findOne({ id: key })
    }
}
