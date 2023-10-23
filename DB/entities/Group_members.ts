import {
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    OneToOne,
    JoinColumn,
    ManyToMany,
    JoinTable,
  } from "typeorm";
  import { Groups } from "./Groups.js";
  import { User } from "./User.js";
  
  @Entity()
  export class Group_members extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;
  
    @ManyToMany(() => User)
    @JoinTable()
    user: User[];
  }
  