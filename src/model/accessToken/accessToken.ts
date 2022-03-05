import { EntityModel } from '@midwayjs/orm'
import { Column } from 'typeorm'
import { BaseEntityModel } from '../BaseEntityModel'

@EntityModel('access_token')
export class AccessToken extends BaseEntityModel {
    @Column({ comment: '学工号', length: 10, type: 'varchar', nullable: false })
    staffID: string

    @Column({ comment: 'user-agent', length: 255, type: 'varchar' })
    userAgent: string

    @Column({ type: 'timestamp', nullable: false })
    expiredTime: Date

    @Column({ type: 'varchar', length: '20' })
    ip: string

    @Column({
        comment: 'access_token',
        type: 'varchar',
        length: 191,
        nullable: false,
    })
    accessToken: string

    isValid(): boolean {
        return (
            this.accessToken !== undefined &&
            this.expiredTime !== undefined &&
            this.expiredTime > new Date()
        )
    }
}
