export const USER_API_URL_PATTERN = /^[\/](api\/users)([\/]\w+)?/;
export const USER_API_BASE_PATTERN = /^[\/](api\/users)[\/]?$/;
export const USER_API_BASE_URL = '/api/users';

export enum HtppStatusCode {
    OK = 200,
    CREATED = 201,
    NOT_FOUND = 404,
    BAD_REQUEST = 400,
    INTERNAL_SERVER_ERROR = 500,
}

export enum ERROR_MESSAGE {
    NOT_VALID_UUID = 'Provided ID is not a valid UUID value!',
    USER_NOT_FOUND = 'User not found',
    PROVIDE_VALI_BODY = 'Please provide request body!',
    PROVIDE_VALID_URL = 'Please provide a valid URL string for this request method',
    VALID_VALUE = 'Please fill all required data {username: str, age: number, hobbies: array(string)}',
}

export enum HTTP_METHODS {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
}
