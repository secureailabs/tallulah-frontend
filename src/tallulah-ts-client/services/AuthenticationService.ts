/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Body_login } from '../models/Body_login';
import type { LoginSuccess_Out } from '../models/LoginSuccess_Out';
import type { RefreshToken_In } from '../models/RefreshToken_In';
import type { ResetPassword_In } from '../models/ResetPassword_In';
import type { UpdateUser_In } from '../models/UpdateUser_In';
import type { UserInfo_Out } from '../models/UserInfo_Out';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class AuthenticationService {

    /**
     * Ssologin
     * User login with firebase token
     * @returns LoginSuccess_Out Successful Response
     * @throws ApiError
     */
    public static ssologin(): CancelablePromise<LoginSuccess_Out> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/ssologin',
            errors: {
                401: `Incorrect username or password`,
            },
        });
    }

    /**
     * Login For Access Token
     * User login with email and password
     * @param formData
     * @returns LoginSuccess_Out Successful Response
     * @throws ApiError
     */
    public static login(
        formData: Body_login,
    ): CancelablePromise<LoginSuccess_Out> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/login',
            formData: formData,
            mediaType: 'application/x-www-form-urlencoded',
            errors: {
                401: `Incorrect username or password`,
                422: `Validation Error`,
            },
        });
    }

    /**
     * Refresh For Access Token
     * Refresh the JWT token for the user
     * @param requestBody
     * @returns LoginSuccess_Out Successful Response
     * @throws ApiError
     */
    public static getRefreshToken(
        requestBody: RefreshToken_In,
    ): CancelablePromise<LoginSuccess_Out> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/refresh-token',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Could not validate credentials.`,
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Current User Info
     * Get the current user information
     * @returns UserInfo_Out The current user information
     * @throws ApiError
     */
    public static getCurrentUserInfo(): CancelablePromise<UserInfo_Out> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/me',
        });
    }

    /**
     * Reset User Password
     * Reset the user password
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static resetUserPassword(
        requestBody: ResetPassword_In,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/password-reset',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Incorrect current password`,
                422: `Validation Error`,
            },
        });
    }

    /**
     * Unlock User Account
     * Unlock the user account
     * @param userId The user id to unlock the account for
     * @returns void
     * @throws ApiError
     */
    public static unlockUserAccount(
        userId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/unlock-account/{user_id}',
            path: {
                'user_id': userId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Enable 2Fa
     * Enable 2FA for the user
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static enable2Fa(
        requestBody: UpdateUser_In,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/enable-2fa',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Phone number is required`,
                422: `Validation Error`,
            },
        });
    }

    /**
     * Migrate Users
     * Migrate users to firebase
     * @returns void
     * @throws ApiError
     */
    public static migrateUsers(): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/auth/migrate-users',
        });
    }

}