import { EntityModel } from '@midwayjs/orm'
import { Column } from 'typeorm'

@EntityModel('router_item')
export class RouteItem {
    @Column({ comment: '路径' })
    location: string

    @Column({ comment: '方法' })
    method: string

    @Column({ comment: '是否需要登录' })
    needAuthorized: boolean

    @Column({ comment: '是否需要回调' })
    needRedirect: boolean

    Url() {

    }
}
