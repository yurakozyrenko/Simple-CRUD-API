import { IncomingMessage, ServerResponse } from 'http';
import { User } from '../types/user-types';
import { v4, validate } from 'uuid';
import { usersControllers } from '../controllers/usersControllers';
import { HttpResponse } from '../types/server-types';

import {
    USER_API_BASE_PATTERN,
    ERROR_MESSAGE,
    HTTP_METHODS,
    USER_API_BASE_URL,
    USER_API_URL_PATTERN,
    HtppStatusCode,
} from '../constants/constants';

export const parseBody = async (req: IncomingMessage) => {
    return new Promise((resolve) => {
        const body: Buffer[] = [];
        req.on('data', (chunk) => body.push(chunk));

        req.on('end', () => {
            const reqBody = Buffer.concat(body).toString();
            let requestData = {};
            try {
                requestData = JSON.parse(reqBody);
            } catch (error) {
                resolve(null);
            }
            resolve(requestData);
        });
    });
};

const isPostBodyValid = (body: User) => {
    const { username, age, hobbies } = body;
    const isSchemaValid = Boolean(username && age && hobbies);
    const isTypificationValid = Boolean(
        typeof age === 'number' &&
            typeof username === 'string' &&
            Array.isArray(hobbies)
    );

    return isSchemaValid && isTypificationValid;
};

export const handleRequest = async (
    req: IncomingMessage,
    res: ServerResponse
): Promise<HttpResponse> => {
    const { method, url } = req;

    console.log(`[INFO] REQUEST ${method}: '${url}'\n`);

    if (USER_API_URL_PATTERN.test(url as string)) {
        const isOnlyBaseProvided = USER_API_BASE_PATTERN.test(url as string);

        switch (method) {
            case HTTP_METHODS.GET: {
                if (isOnlyBaseProvided) {
                    return {
                        response: JSON.stringify({
                            data: usersControllers.getAllUsers(),
                        }),
                        status: HtppStatusCode.OK,
                    };
                }
                const uuid = url?.replace(USER_API_BASE_URL, '') as string;
                if (validate(uuid)) {
                    const searchResult = usersControllers.getUserById(uuid);
                    return {
                        response: JSON.stringify(
                            searchResult ? searchResult : []
                        ),
                        status: searchResult
                            ? HtppStatusCode.OK
                            : HtppStatusCode.NOT_FOUND,
                    };
                }
                return {
                    response: JSON.stringify({
                        error: ERROR_MESSAGE.NOT_VALID_UUID,
                    }),
                    status: HtppStatusCode.NOT_FOUND,
                };
            }

            case HTTP_METHODS.POST:
                if (isOnlyBaseProvided) {
                    const requestBody: any = await parseBody(req);
                    if (!requestBody) {
                        return {
                            response: JSON.stringify({
                                error: ERROR_MESSAGE.PROVIDE_VALI_BODY,
                            }),
                            status: HtppStatusCode.BAD_REQUEST,
                        };
                    }

                    if (isPostBodyValid(requestBody)) {
                        const userId: string = v4();
                        const newUser: User = {
                            id: userId,
                            ...requestBody,
                        };
                        usersControllers.createUser(newUser);

                        return {
                            response: JSON.stringify(
                                usersControllers.getAllUsers()
                            ),
                            status: HtppStatusCode.CREATED,
                        };
                    }
                    return {
                        response: JSON.stringify({
                            error: ERROR_MESSAGE.VALID_VALUE,
                        }),
                        status: HtppStatusCode.NOT_FOUND,
                    };
                }
                return {
                    response: JSON.stringify({
                        error: ERROR_MESSAGE.PROVIDE_VALID_URL,
                    }),
                    status: HtppStatusCode.BAD_REQUEST,
                };

            case HTTP_METHODS.PUT:
                if (isOnlyBaseProvided) {
                    const uuid = url?.replace(USER_API_BASE_URL, '') as string;

                    if (validate(uuid)) {
                        const searchResult = usersControllers.getUserById(uuid);
                        if (!searchResult) {
                            return {
                                response: JSON.stringify({
                                    error: ERROR_MESSAGE.USER_NOT_FOUND,
                                }),
                                status: HtppStatusCode.BAD_REQUEST,
                            };
                        }

                        const requestBody: any = await parseBody(req);

                        const updateData: User = requestBody ? requestBody : {};

                        const user: User | undefined =
                            usersControllers.updateUserById(uuid, updateData);

                        return {
                            response: JSON.stringify({
                                data: user,
                            }),
                            status: HtppStatusCode.OK,
                        };
                    }
                    return {
                        response: JSON.stringify({
                            error: ERROR_MESSAGE.NOT_VALID_UUID,
                        }),
                        status: HtppStatusCode.NOT_FOUND,
                    };
                }
                return {
                    response: JSON.stringify({
                        error: ERROR_MESSAGE.PROVIDE_VALID_URL,
                    }),
                    status: HtppStatusCode.BAD_REQUEST,
                };

            case HTTP_METHODS.DELETE:
                if (isOnlyBaseProvided) {
                    const uuid = url?.replace(USER_API_BASE_URL, '') as string;

                    if (validate(uuid)) {
                        const searchResult = usersControllers.getUserById(uuid);
                        if (!searchResult) {
                            return {
                                response: JSON.stringify({
                                    error: ERROR_MESSAGE.USER_NOT_FOUND,
                                }),
                                status: HtppStatusCode.BAD_REQUEST,
                            };
                        }

                        usersControllers.deleteUser(uuid);

                        return {
                            response: JSON.stringify({}),
                            status: 204,
                        };
                    }
                    return {
                        response: JSON.stringify({
                            error: ERROR_MESSAGE.NOT_VALID_UUID,
                        }),
                        status: HtppStatusCode.NOT_FOUND,
                    };
                }
                return {
                    response: JSON.stringify({
                        error: ERROR_MESSAGE.PROVIDE_VALID_URL,
                    }),
                    status: HtppStatusCode.BAD_REQUEST,
                };
            default:
                return {
                    response: JSON.stringify({
                        error: ERROR_MESSAGE.PROVIDE_VALID_URL,
                    }),
                    status: HtppStatusCode.BAD_REQUEST,
                };
        }
    } else {
        return {
            response: JSON.stringify({
                error: ERROR_MESSAGE.PROVIDE_VALID_URL,
            }),
            status: HtppStatusCode.BAD_REQUEST,
        };
    }
};
