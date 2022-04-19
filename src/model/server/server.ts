import { EntityModel } from '@midwayjs/orm'
import { Column } from 'typeorm'
import { BaseEntityModel } from '../BaseEntityModel'

@EntityModel('server_dev')
export class Server extends BaseEntityModel {
    @Column({ length: 255, type: 'varchar', nullable: false })
    addr: string

    @Column({ length: 20, type: 'varchar', unique: true, nullable: false })
    key: string
}
