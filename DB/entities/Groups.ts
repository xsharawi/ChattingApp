import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, JoinColumn, OneToOne, ManyToMany, OneToMany, JoinTable } from "typeorm";
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

    @ManyToMany(() => Group_members)
    @JoinTable()
    group_member: Group_members[]

    @OneToOne(() => Group_members)
    @JoinColumn()
    Group_id: Group_members
}