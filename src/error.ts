interface IHttpException extends Error {
    status: number
    message: string
}

export class HttpException  extends Error implements IHttpException {
    public status: number
    public message: string
    constructor(status: number, message: string) {
        super(message)
        this.status = status
        this.message = message
    }
}
