import { BaseEntity, Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from "typeorm";
import { StringArray } from "./Stringarray.js";
import { Cipher } from "crypto";

@Entity()
export class Contact extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  primary: string;

  @Column()
  id: string;

  @ManyToMany(() => StringArray, { onDelete: "CASCADE"})
  @JoinTable()
  contacts: StringArray[];

  @ManyToMany(() => StringArray, { onDelete: "CASCADE" })
  @JoinTable()
  mutecontact: StringArray[];

  @ManyToMany(() => StringArray, { onDelete: "CASCADE" })
  @JoinTable()
  blockcontact: StringArray[];

}
