export class HttpError extends Error {

    public statusCode:number;

    constructor(public status: number, message?: string,public data?:any) {
        super(message);

        this.statusCode = status;

        Object.setPrototypeOf(this, HttpError.prototype);

    }
}