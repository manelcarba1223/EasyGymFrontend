import { Gimnasio } from "../gimnasio/gimnasio";

export class User {

    id: number;
    username: string;
    name: string;
    lastname: string;
    email: string;
    password: string;
    phone: string;
    birth_date: Date;
    gimnasios: Gimnasio[];
    roles: any[]

  
    constructor(
      id: number,
      username: string,
      name: string,
      lastname: string,
      email: string,
      password: string,
      phone: string,
      birth_date: Date,
      gimnasios: Gimnasio[],
      roles: any[]
    ) {
      this.id=id;
      this.username = username;
      this.name = name;
      this.lastname = lastname;
      this.email = email;
      this.password = password;
      this.phone = phone;
      this.birth_date = birth_date;
      this.gimnasios=gimnasios;
      this.roles=roles;
    }
  }