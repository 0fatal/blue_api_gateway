import { EntityModel } from '@midwayjs/orm'
import { Column } from 'typeorm'
import { BaseEntityModel } from '../BaseEntityModel'

@EntityModel('access_token')
export class AccessToken extends BaseEntityModel {
    @Column({ comment: '学工号', length: 10 })
    staffID: string

    @Column()
    userAgent: string

    @Column()
    expiredTime: Date

    @Column()
    ip: string

    @Column({ unique: true, comment: 'access_token', length: 191 })
    accessToken: string

    isValid(): boolean {
        return (
            this.accessToken !== undefined &&
            this.expiredTime !== undefined &&
            this.expiredTime > new Date()
        )
    }
}
