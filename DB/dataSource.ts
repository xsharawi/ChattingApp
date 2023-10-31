import { DataSource } from "typeorm";
import { Chat } from "./entities/Chat.js";
import { Group_chats } from "./entities/Group_chats.js";
import { Group_members } from "./entities/Group_members.js";
import { Groups } from "./entities/Groups.js";
import { User } from "./entities/User.js";
import { Contact } from "./entities/Contact.js";
import { StringArray } from "./entities/Stringarray.js";
const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Chat,  Groups, Group_chats, Group_members, User , Contact, StringArray],
  synchronize: true, 
  logging: process.env.NODE_ENV === 'development',
});

export const init = async () => {
  try {
    await dataSource.initialize();
    console.log("Connected to DB!");
  } catch (error) {
    console.error('Failed to connect to DB:', error);
  }
};

export default dataSource;
