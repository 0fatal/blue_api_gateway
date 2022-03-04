import { EntityModel } from '@midwayjs/orm'
import { Column } from 'typeorm'
import { BaseEntityModel } from '../BaseEntityModel'

@EntityModel('server')
export class Server extends BaseEntityModel {
    @Column()
    addr: string

    @Column()
    key: string
}
