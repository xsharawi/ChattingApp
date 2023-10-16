import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToMany, JoinTable } from "typeorm";
import { User } from "./User.js";
@Entity()
export class Contact extends BaseEntity{
    @Column()
    contact_id: string

    @ManyToMany(() => User)
    @JoinTable()
    User: User[]
}