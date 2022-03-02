import { EntityModel } from '@midwayjs/orm'
import { Column, PrimaryColumn } from 'typeorm'

@EntityModel('server')
export class Server {
    @PrimaryColumn()
    id: string

    @Column()
    addr: string

    @Column()
    key: string
}
