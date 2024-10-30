/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GetUsers_Out } from '../models/GetUsers_Out';
import type { RegisterUser_In } from '../models/RegisterUser_In';
import type { RegisterUser_Out } from '../models/RegisterUser_Out';
import type { UpdateUser_In } from '../models/UpdateUser_In';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class UsersService {

    /**
     * Register User
     * Register new user
     * @param requestBody
     * @returns RegisterUser_Out Successful Response
     * @throws ApiError
     */
    public static registerUser(
        requestBody: RegisterUser_In,
    ): CancelablePromise<RegisterUser_Out> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/users',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Organization not provided`,
                403: `Unauthorized`,
                409: `Organization already exists`,
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get User
     * Get information about a user
     * @param userId UUID of the user
     * @returns GetUsers_Out Successful Response
     * @throws ApiError
     */
    public static getUser(
        userId: string,
    ): CancelablePromise<GetUsers_Out> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/users/{user_id}',
            path: {
                'user_id': userId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update User Info
     * Update user information.
     * @param userId UUID of the user
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static updateUserInfo(
        userId: string,
        requestBody: UpdateUser_In,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/users/{user_id}',
            path: {
                'user_id': userId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `Unauthorized`,
                422: `Validation Error`,
            },
        });
    }

    /**
     * Soft Delete User
     * Soft Delete user
     * @param userId UUID of the user
     * @returns void
     * @throws ApiError
     */
    public static softDeleteUser(
        userId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/users/{user_id}',
            path: {
                'user_id': userId,
            },
            errors: {
                403: `Unauthorized`,
                422: `Validation Error`,
            },
        });
    }

}