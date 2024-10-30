/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GetMultipleResponseTemplate_Out } from '../models/GetMultipleResponseTemplate_Out';
import type { GetResponseTemplate_Out } from '../models/GetResponseTemplate_Out';
import type { RegisterResponseTemplate_In } from '../models/RegisterResponseTemplate_In';
import type { RegisterResponseTemplate_Out } from '../models/RegisterResponseTemplate_Out';
import type { UpdateResponseTemplate_In } from '../models/UpdateResponseTemplate_In';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ResponseTemplatesService {

    /**
     * Get All Response Templates
     * Get all the response templates for the current user
     * @returns GetMultipleResponseTemplate_Out Successful Response
     * @throws ApiError
     */
    public static getAllResponseTemplates(): CancelablePromise<GetMultipleResponseTemplate_Out> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/response-templates/',
        });
    }

    /**
     * Add New Response Template
     * Add a new resposne template
     * @param requestBody
     * @returns RegisterResponseTemplate_Out Successful Response
     * @throws ApiError
     */
    public static addNewResponseTemplate(
        requestBody: RegisterResponseTemplate_In,
    ): CancelablePromise<RegisterResponseTemplate_Out> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/response-templates/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Response Template
     * Get the response template for the current user
     * @param responseTemplateId Response template id
     * @returns GetResponseTemplate_Out Successful Response
     * @throws ApiError
     */
    public static getResponseTemplate(
        responseTemplateId: string,
    ): CancelablePromise<GetResponseTemplate_Out> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/response-templates/{response_template_id}',
            path: {
                'response_template_id': responseTemplateId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update Response Template
     * Update the response template for the current user
     * @param responseTemplateId Response template id
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static updateResponseTemplate(
        responseTemplateId: string,
        requestBody: UpdateResponseTemplate_In,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/response-templates/{response_template_id}',
            path: {
                'response_template_id': responseTemplateId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Delete Response Template
     * Delete the response template for the current user
     * @param responseTemplateId Response template id
     * @returns void
     * @throws ApiError
     */
    public static deleteResponseTemplate(
        responseTemplateId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/response-templates/{response_template_id}',
            path: {
                'response_template_id': responseTemplateId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

}