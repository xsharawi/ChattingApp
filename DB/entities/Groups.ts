import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, JoinColumn, OneToOne, ManyToMany, OneToMany } from "typeorm";
import { User } from './User.js'
import { Group_members } from "./Group_members.js";

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

    @ManyToMany(() => User)
    @JoinColumn()
    user: User[];

    @OneToOne(() => Group_members)
    @JoinColumn()
    groupmember: Group_members
}