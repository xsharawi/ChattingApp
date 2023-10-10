import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";

@Entity()
export class Contact extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    chat_id: string

    @Column()
    sender_id:string

    @Column()
    receiver_id:string

    @Column()
    text: string

    @Column()
    encryption_key: string

    @CreateDateColumn({
        type: 'timestamp',
        default: () => "CURRENT_TIMESTAMP()"
    })
    sent_at: Date;

}