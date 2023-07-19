import User from '../../models/User';
import bcrypt from 'bcrypt';

class UserRepository {
    private users: User[];

    constructor() {
        this.users = [];
    }

    async registerUser(login: string, password: string): Promise<User | Error> {
        const result = this.users.filter((value) => {
            return value.login === login;
        });

        if (result.length > 0) {
            return {
                code: 400,
                message: 'This login is already used.',
            } as Error;
        }

        const hash = await bcrypt.hash(password, 10);

        const newUser: User = {
            login,
            hash,
            attempts: 0,
            createdOn: new Date(),
        };
        this.users.push(newUser);

        return newUser;
    }

    async loginUser(login: string, password: string): Promise<User | Error> {
        const result = this.users.filter((value) => {
            return value.login === login;
        });

        if (result.length === 0) {
            return {
                code: 400,
                message: 'Username or Password is incorrect.',
            } as Error;
        }

        const user = result[0];

        const isPasswordValid = await bcrypt.compare(password, user.hash);

        if (!isPasswordValid) {
            return {
                code: 400,
                message: 'Username or Password is incorrect.',
            } as Error;
        }

        return user;
    }
}

export default UserRepository;
