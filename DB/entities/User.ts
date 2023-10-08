import { BaseEntity, Entity, PrimaryGeneratedColumn, CreateDateColumn, Column, BeforeInsert} from "typeorm";
import bcrypt from 'bcrypt';


@Entity()
export class User extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    user_id: string;

    @Column({nullable: false})
    username: string;

    @Column({nullable: false})
    email: string

    @BeforeInsert()
    async hashPassword() {
        if (this.password) {
            this.password = await bcrypt.hash(this.password, 10)
        }
    }
    @Column({ nullable: false })
    password: string;

    @Column()
    image: string

    @Column()
    bio: string;

    @CreateDateColumn({
        type: 'timestamp',
        default: () => "CURRENT_TIMESTAMP()"
    })
    created_at: Date;
}