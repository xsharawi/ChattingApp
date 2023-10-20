import { BaseEntity, Entity, ManyToOne, OneToOne, Column } from "typeorm";
import { JoinColumn } from "typeorm/browser";
import { Groups } from "./Groups.js";
import { ManyToMany } from "typeorm/browser";
import { User } from "./User.js";


@Entity()
export class Group_members extends BaseEntity{

    @Column()
    member_id: string

    @OneToOne(()=> Groups)
    @JoinColumn()
    group:Groups

    @ManyToMany(() => User)
    @JoinColumn()
    user: User[];
}