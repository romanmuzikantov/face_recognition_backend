export interface Error {
    code: number;
    message: string;
}

export function isError(error: any): error is Error {
    return (error as Error).code !== undefined;
}
