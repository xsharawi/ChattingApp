import { BaseEntity, Entity, Column, CreateDateColumn, PrimaryGeneratedColumn, OneToOne, ManyToOne, JoinColumn } from "typeorm";
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

    @ManyToOne(
        ()=> Groups,
        group=> group.id,
        {
          cascade: true,
          onDelete: 'SET NULL',
          onUpdate: 'CASCADE'
        }
      )
    @OneToOne(() => User)
    @JoinColumn()
    sender_id: User
    company: string;

}