import { BaseEntity, Entity, Column, CreateDateColumn, PrimaryGeneratedColumn, OneToOne, ManyToOne, JoinColumn, JoinTable } from "typeorm";
import { Groups } from "./Groups.js";
import { User } from "./User.js";


@Entity()
export class Group_chats extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    group_chat_id: string

    @Column({nullable: false})
    chat_text: string

    @CreateDateColumn({
        type: 'timestamp',
        default: () => "CURRENT_TIMESTAMP()"
    })
    send_at: Date;

    @Column({default:false})
    edited:boolean
    
    @OneToOne(() => User)
    @JoinColumn()
    sender_id: User

    @ManyToOne(() => Groups, group => group.group_chats, {
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    })
    @JoinColumn({ name: "groupid" })
    group: Groups;
    
}