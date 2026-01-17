class ApiResponse {
    constructor(data = null, message = "Request successful", statusCode = 200) {
        this.data = data;
        this.message = message;
        this.statusCode = statusCode;
        this.success = statusCode >= 200 && statusCode < 400;
    }
}