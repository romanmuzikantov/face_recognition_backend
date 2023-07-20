export interface DatabaseError {
    code: string;
    constraint: string;
}

export function isDatabaseError(error: any): error is DatabaseError {
    return (error as DatabaseError).code !== undefined;
}
