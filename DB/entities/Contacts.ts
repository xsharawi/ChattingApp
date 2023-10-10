import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";

@Entity()
export class Contact extends BaseEntity{
    @Column()
    contact_id: string
}