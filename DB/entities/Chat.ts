import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";

@Entity()
export class Chat extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    chat_id: string

    @Column()
    sender_id:string

    @Column()
    receiver_id:string

    @Column({update:true})
    text: string

    @Column()
    encryption_key: string

    @Column({default:false})
    edited:boolean

    @CreateDateColumn({
        type: 'timestamp',
        default: () => "CURRENT_TIMESTAMP()"
    })
    sent_at: Date;
}