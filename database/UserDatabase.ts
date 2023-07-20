import knex, { Knex } from 'knex';
import { DatabaseError } from '../models/DatabaseError';

class UserDatabase {
    private db: Knex;

    constructor() {
        this.db = knex({
            client: 'pg',
            connection: {
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
                port: +process.env.DB_PORT!,
            },
            pool: { min: 0, max: 7 },
        });
    }

    async insertUser(user: UserDbo): Promise<DatabaseError | number[]> {
        try {
            const result = await this.db('users').insert({
                username: user.username,
                joined: user.joined,
            });

            return result;
        } catch (error: any) {
            console.error(error);

            return error as DatabaseError;
        }
    }

    async insertLogin(login: LoginDbo): Promise<DatabaseError | number[]> {
        try {
            const result = await this.db('login').insert({
                username: login.username,
                hash: login.hash,
            });

            return result;
        } catch (error: any) {
            console.error(error);

            return error as DatabaseError;
        }
    }

    async getLogin(username: string): Promise<LoginDbo[]> {
        const result = await this.db
            .select('*')
            .from<LoginDbo>('login')
            .where('username', username);
        return result;
    }

    async getUser(username: string): Promise<UserDbo[]> {
        const result = await this.db.select('*').from<UserDbo>('users').where('username', username);
        return result;
    }
}

export default UserDatabase;
