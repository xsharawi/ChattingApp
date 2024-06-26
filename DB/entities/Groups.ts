import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, JoinColumn, OneToOne, ManyToMany, OneToMany, JoinTable } from "typeorm";
import { User } from './User.js'
import { Group_members } from "./Group_members.js";
import { Group_chats } from "./Group_chats.js";
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

    @OneToOne(() => Group_members , {onDelete:"CASCADE"})
    @JoinColumn()
    Group_id: Group_members

    @ManyToMany(() => User , {onDelete:"CASCADE"})
    @JoinTable()
    Admin: User[]

    @OneToMany(() => Group_chats, group_chat => group_chat.group)
    group_chats: Group_chats[];
}