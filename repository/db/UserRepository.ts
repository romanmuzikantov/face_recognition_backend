import User from '../../models/User';

class UserRepository {
    private users: User[];

    constructor() {
        this.users = [];
    }

    registerUser(login: string, password: string): User | Error {
        const result = this.users.filter((value) => {
            return value.login === login;
        });

        if (result.length > 0) {
            return {
                code: 400,
                message: 'This login is already used.',
            } as Error;
        }

        const newUser: User = {
            login,
            password,
            attempts: 0,
        };
        this.users.push(newUser);

        return newUser;
    }

    loginUser(login: string, password: string): User | Error {
        const result = this.users.filter((value) => {
            return value.login === login;
        });

        if (result.length === 0) {
            return {
                code: 400,
                message: 'User not found.',
            } as Error;
        }

        return result[0];
    }
}

export default UserRepository;
