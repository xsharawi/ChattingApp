import { Entity , PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn} from "typeorm";
import { Contact } from "./Contact.js";
@Entity()
export class StringArray extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id1: string;

    @Column("simple-array", {nullable: true})
    id: string;
  }