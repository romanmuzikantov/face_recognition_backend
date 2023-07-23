import UserDatabase from '../../database/UserDatabase.js';
import bcrypt from 'bcrypt';
import { isDatabaseError } from '../../models/DatabaseError.js';
import { Error } from '../../models/Error.js';

class UserRepository {
    async registerUser(login: string, password: string): Promise<UserDbo | Error> {
        const hash = await bcrypt.hash(password, 10);

        const newUser: UserDbo = {
            id: undefined,
            username: login,
            entries: 0,
            joined: new Date(),
        };

        const newLogin: LoginDbo = {
            id: undefined,
            username: login,
            hash,
        };

        const userDatabase: UserDatabase = new UserDatabase();

        const insertUserResult = await userDatabase.insertNewUser(newUser, newLogin);

        if (isDatabaseError(insertUserResult)) {
            if (
                insertUserResult.constraint === 'users_username_key' ||
                insertUserResult.constraint === 'login_username_key'
            ) {
                return {
                    code: 400,
                    message: 'This user already exists.',
                } as Error;
            } else {
                return {
                    code: 500,
                    message: 'An unexpected error occured.',
                } as Error;
            }
        }

        if (insertUserResult.id === undefined) {
            return {
                code: 500,
                message: 'User could not be created.',
            } as Error;
        }

        return insertUserResult;
    }

    async loginUser(username: string, password: string): Promise<UserDbo | Error> {
        const userDatabase: UserDatabase = new UserDatabase();

        const loginSqlResult = await userDatabase.getLogin(username);

        if (loginSqlResult.length === 0) {
            return {
                code: 400,
                message: 'Username or password is incorrect',
            } as Error;
        }

        const login = loginSqlResult[0];

        const isPasswordValid = await bcrypt.compare(password, login.hash);

        if (!isPasswordValid) {
            return {
                code: 400,
                message: 'Username or password is incorrect.',
            } as Error;
        }

        const userSqlResult = await userDatabase.getUser(username);

        if (userSqlResult.length === 0) {
            return {
                code: 500,
                message: 'Unexpected error occured.',
            } as Error;
        }

        const user = userSqlResult[0];

        return user;
    }

    async incrementUserEntries(userId: number): Promise<number> {
        const userDatabase = new UserDatabase();

        const result = await userDatabase.IncrementEntries(userId);

        return result;
    }
}

export default UserRepository;
