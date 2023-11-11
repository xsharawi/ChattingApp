export namespace NSUser {
  
    export interface Item {
      id: string;
      username: string;
      email: string;
      password: string;
      image?: string;
      bio?: string;
      created_at: Date;
      dob: Date;
    }
}