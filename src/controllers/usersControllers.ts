import cluster from 'cluster';
import { setData } from '../config/db';
import { User } from '../types/user-types';
import { v4 } from 'uuid';

export class UsersControllers {
    private database: User[] = [];

    constructor() {}

    public setUsers(users: User[]) {
        this.database = users;
    }

    public getAllUsers() {
        return this.database;
    }

    public getUserById(uuid: string) {
        return this.database.find((user) => user.id === uuid);
    }

    public createUser(data: User) {
        data.id = v4();

        this.database.push(data);

        if (cluster.isWorker) {
            setData('users', this.database);
        }
    }

    public updateUserById(uuid: string, data: User) {
        const { username, age, hobbies } = data;
        this.database = this.database.map((user) => {
            if (username) {
                user.username = username;
            }
            if (age) {
                user.age = age;
            }
            if (hobbies) {
                user.hobbies = hobbies;
            }
            return user;
        });
        if (cluster.isWorker) {
            setData('users', this.database);
        }
        return this.getUserById(uuid);
    }

    public deleteUser(uuid: string) {
        this.database = this.database.filter((el) => el.id !== uuid);
        if (cluster.isWorker) {
            setData('users', this.database);
        }
    }
}

export const usersControllers = new UsersControllers()