import { BaseEntity, Entity, ManyToOne, OneToOne, Column, PrimaryGeneratedColumn } from "typeorm";
import { JoinColumn } from "typeorm/browser";
import { Groups } from "./Groups.js";
import { ManyToMany } from "typeorm/browser";
import { User } from "./User.js";


@Entity()
export class Group_members extends BaseEntity{

    @PrimaryGeneratedColumn('uuid')
    member_id: string

    @ManyToMany(() => User)
    @JoinColumn()
    user: User[];
}