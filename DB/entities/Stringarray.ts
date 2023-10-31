import { Entity , PrimaryGeneratedColumn, Column, BaseEntity} from "typeorm";
@Entity()
export class StringArray extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id1: string;
  
    @Column("simple-array", {nullable: true })
    id: string;
  }