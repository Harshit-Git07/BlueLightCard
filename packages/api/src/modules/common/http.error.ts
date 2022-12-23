
export class HttpError extends Error {
    public static BadRequest = 400
    public static Unauthenticated = 401
    public static PaymentRequired = 402
    public static Unauthorized = 403
    public static NotFound = 404
    public static MethodNotAllowed = 405
    public static NotAcceptable = 406
    public static Conflict = 409
    public static Gone = 410
    public static LengthRequired = 411
    public static PreconditionFailed = 412
    public static UnsupportedMediaType = 415
    public static UnprocessableEntity = 422
    public static PreconditionRequired = 428
    public static TooManyRequests = 429
    public static InternalServerError = 500
    public static ServiceUnavailable = 503
  
    statusCode: number
    code: number
  
    constructor(statusCode: number, message: string) {
      super(message)
      this.statusCode = statusCode
    }
  
    serialize(): { status: number; code: number; message: string } {
      return {
        status: this.statusCode,
        code: this.code || null,
        message: this.message
      }
    }
  }