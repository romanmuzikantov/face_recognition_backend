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

    async insertNewUser(user: UserDbo, login: LoginDbo): Promise<DatabaseError | UserDbo> {
        return await this.db.transaction(async (trx) => {
            try {
                const userInsert = this.db('users')
                    .insert({
                        username: user.username,
                        joined: user.joined,
                    })
                    .transacting(trx)
                    .returning('id');

                const loginInsert = this.db('login')
                    .insert({
                        username: login.username,
                        hash: login.hash,
                    })
                    .transacting(trx);

                await loginInsert;
                const result = await userInsert;
                user.id = result[0].id;

                trx.commit;

                return user;
            } catch (error: any) {
                console.error(error);
                trx.rollback;

                return error as DatabaseError;
            }
        });
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

    async IncrementEntries(userId: number): Promise<number> {
        const result = await this.db('users')
            .where('id', '=', userId)
            .increment({
                entries: 1,
            })
            .returning('entries');
        return +result[0].entries;
    }
}

export default UserDatabase;
