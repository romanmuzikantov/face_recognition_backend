interface User {
    login: string;
    hash: string;
    attempts: number;
    createdOn: Date;
}

export default User;
