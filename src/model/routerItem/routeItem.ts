import { ClassPropertyWithExcludeExtend } from '@/types'
import { defineProperties } from '@/utils/base'
import { EntityModel } from '@midwayjs/orm'
import { Column, Index } from 'typeorm'
import { BaseEntityModel } from '../BaseEntityModel'

// http://server.addr/father/location
@Index(['method', 'location', 'father', 'remote'], { unique: true })
@EntityModel('router_item')
export class RouteItem extends BaseEntityModel {
    // 对外暴露的path
    @Column({ comment: '路径', length: 255, type: 'varchar', nullable: false })
    location: string

    @Column({ comment: '方法', length: '6', type: 'varchar', nullable: false })
    method: string

    @Column({
        comment: '是否需要登录  0:否/1:是',
        default: 0,
        type: 'tinyint',
    })
    needAuthorized: boolean

    @Column({ comment: '是否需要回调 0:否/1:是', default: 0, type: 'tinyint' })
    needRedirect: boolean

    @Column({
        type: 'varchar',
        length: 512,
        comment: '需要转发的请求头,以逗号分隔',
        default: '',
        transformer: {
            to: (value: string[]) => {
                console.log(value)
                return value.join(',')
            },
            from: (value: string) => {
                if (value === '') return []
                return value.split(',')
            },
        },
    })
    DirectThroughRequestHeaders: string[]

    @Column({
        type: 'varchar',
        length: 512,
        comment: '需要转发的响应头，以逗号分隔',
        default: '',
        transformer: {
            to: (value: string[]) => {
                return value.join(',')
            },
            from: (value: string) => {
                if (value === '') return []
                return value.split(',')
            },
        },
    })
    DirectThroughResponseHeaders: string[]

    @Column({
        comment: '远端路径',
        length: 255,
        type: 'varchar',
        nullable: false,
    })
    remote: string

    @Column({
        comment: '从属api',
        length: 20,
        type: 'varchar',
        nullable: false,
    })
    father: string

    constructor(
        props: ClassPropertyWithExcludeExtend<RouteItem, BaseEntityModel>
    ) {
        super()
        defineProperties(this, props)
    }
}
