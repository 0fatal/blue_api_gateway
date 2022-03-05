import {
    CreateDateColumn,
    DeleteDateColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm'

export class BaseEntityModel {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date

    @DeleteDateColumn({ type: 'timestamp' })
    deletedAt: Date

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date
}
