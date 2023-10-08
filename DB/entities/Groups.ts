import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, JoinColumn, OneToOne } from "typeorm";
import { User } from './User.js'

@Entity()
export class Groups extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    group_name: string

    @Column()
    created_by: string

    @CreateDateColumn({
        type: 'timestamp',
        default: () => "CURRENT_TIMESTAMP()"
    })
    created_at: Date;

    @OneToOne(() => User)
    @JoinColumn()
    user: User;
}