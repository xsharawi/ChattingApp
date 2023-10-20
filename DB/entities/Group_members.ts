import { BaseEntity, Entity, ManyToOne, OneToOne, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { JoinColumn } from "typeorm/browser";
import { Groups } from "./Groups.js";
import { ManyToMany } from "typeorm/browser";
import { User } from "./User.js";


@Entity()
export class Group_members extends BaseEntity{

    @PrimaryGeneratedColumn('uuid')
    id: string

    @OneToOne(() => Groups)
    @JoinColumn()
    Group_id: Groups

    @ManyToMany(() => User)
    @JoinColumn()
    user: User[];
}