/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserRead } from '../models/UserRead';
import type { UserUpdate } from '../models/UserUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UsersService {
    /**
     * Users:Current User
     * @returns UserRead Successful Response
     * @throws ApiError
     */
    public static usersCurrentUserApiUsersMeGet(): CancelablePromise<UserRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/users/me',
            errors: {
                401: `Missing token or inactive user.`,
            },
        });
    }
    /**
     * Users:Patch Current User
     * @param requestBody
     * @returns UserRead Successful Response
     * @throws ApiError
     */
    public static usersPatchCurrentUserApiUsersMePatch(
        requestBody: UserUpdate,
    ): CancelablePromise<UserRead> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/users/me',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                401: `Missing token or inactive user.`,
                422: `Validation Error`,
            },
        });
    }
}
