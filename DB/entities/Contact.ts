import { BaseEntity, Entity, Column } from "typeorm";

@Entity()
export class Contact extends BaseEntity{
    @Column({
        default: "hello"
    })
    id: String;

    @Column()
    contacts: string[];

    @Column()
    mutecontact: string[];

    @Column()
    blockcontact: string[];

}