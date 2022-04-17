import { ClassProperty } from '@/types'
import { defineProperties } from '@/utils/base'
import { EntityModel } from '@midwayjs/orm'
import { Column } from 'typeorm'
import { BaseEntityModel } from '../BaseEntityModel'

@EntityModel('user')
export class User extends BaseEntityModel {
    @Column({ unique: true, length: 10, type: 'varchar', nullable: false })
    staffID: string

    @Column({
        comment: '密码',
        length: 32,
        type: 'char',
        nullable: false,
    })
    password: string

    @Column({ comment: '昵称', length: 20, type: 'varchar', nullable: false })
    username: string

    @Column({
        type: 'tinyint',
        default: 0,
        comment: '账号状态：0-正常，1-禁用',
    })
    status: number

    @Column({
        type: 'text',
        comment: '个人简介',
    })
    intro: string

    @Column({
        type: 'char',
        length: 11,
        comment: '手机号',
        nullable: false,
    })
    phone: string

    @Column({
        length: 255,
        type: 'varchar',
        comment: '头像',
    })
    avatar: string

    @Column({
        type: 'tinyint',
        nullable: false,
        comment: '0:学生 1:导师 2:管理员',
    })
    role: string

    checkIfAllowLogin(): boolean {
        return this.status === 0
    }

    constructor(props: ClassProperty<User>) {
        super()
        defineProperties(this, props)
    }
}
