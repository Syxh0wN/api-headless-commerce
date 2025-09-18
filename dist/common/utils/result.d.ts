export type Result<T, E = Error> = {
    success: true;
    data: T;
} | {
    success: false;
    error: E;
};
export declare const success: <T>(data: T) => Result<T, never>;
export declare const failure: <E>(error: E) => Result<never, E>;
export declare const isSuccess: <T, E>(result: Result<T, E>) => result is {
    success: true;
    data: T;
};
export declare const isFailure: <T, E>(result: Result<T, E>) => result is {
    success: false;
    error: E;
};
