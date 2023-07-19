import knex, { Knex } from 'knex';

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

    insertUser(user: UserDbo) {
        this.db('users')
            .insert({
                username: user.username,
                joined: user.joined,
            })
            .then(
                (value) => {
                    console.log(value);
                },
                (reason) => {
                    console.log(reason);
                }
            );
    }

    insertLogin(login: LoginDbo) {
        this.db('login')
            .insert({
                username: login.username,
                hash: login.hash,
            })
            .then(
                (value) => {
                    console.log(value);
                },
                (reason) => {
                    console.log(reason);
                }
            );
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
