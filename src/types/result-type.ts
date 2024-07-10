export enum ResultStatus {
    Success = 'Success',
    BadRequest = 'BadRequest',
    Unauthorized = 'Unauthorized',
    Forbidden = 'Forbidden',
    NotFound = 'NotFound'
}
export type Result<T = null> = {
    status: ResultStatus,
    extensions?: [{ field: string, message: string }],
    data: T
}