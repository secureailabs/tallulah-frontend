/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CaptchaRequest } from '../models/CaptchaRequest';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class WebUtilsService {

    /**
     * Verify Captcha
     * Verify captcha token
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static verifyCaptcha(
        requestBody: CaptchaRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/verify-captcha',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

}