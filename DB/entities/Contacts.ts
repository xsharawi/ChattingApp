import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToMany, JoinTable, OneToOne, JoinColumn } from "typeorm";
import { User } from "./User.js";
@Entity()
export class Contact extends BaseEntity{
    @OneToOne(() => User)
    @JoinColumn()
    User_id: string

    @ManyToMany(() => User)
    @JoinTable()
    Contacts: User[]
}