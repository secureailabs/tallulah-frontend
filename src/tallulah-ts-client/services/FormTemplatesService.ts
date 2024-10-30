/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GetFormTemplate_Out } from '../models/GetFormTemplate_Out';
import type { GetMultipleFormTemplate_Out } from '../models/GetMultipleFormTemplate_Out';
import type { RegisterFormTemplate_In } from '../models/RegisterFormTemplate_In';
import type { RegisterFormTemplate_Out } from '../models/RegisterFormTemplate_Out';
import type { UpdateFormTemplate_In } from '../models/UpdateFormTemplate_In';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class FormTemplatesService {

    /**
     * Get All Form Templates
     * Get all the response templates for the current user
     * @returns GetMultipleFormTemplate_Out Successful Response
     * @throws ApiError
     */
    public static getAllFormTemplates(): CancelablePromise<GetMultipleFormTemplate_Out> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/form-templates/',
        });
    }

    /**
     * Add New Form Template
     * Add a new form template
     * @param requestBody
     * @returns RegisterFormTemplate_Out Successful Response
     * @throws ApiError
     */
    public static addNewFormTemplate(
        requestBody: RegisterFormTemplate_In,
    ): CancelablePromise<RegisterFormTemplate_Out> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/form-templates/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Form Template
     * Get the response template for the current user
     * @param formTemplateId Form template id
     * @returns GetFormTemplate_Out Successful Response
     * @throws ApiError
     */
    public static getFormTemplate(
        formTemplateId: string,
    ): CancelablePromise<GetFormTemplate_Out> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/form-templates/{form_template_id}',
            path: {
                'form_template_id': formTemplateId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update Form Template
     * Update the response template for the current user
     * @param formTemplateId Form template id
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static updateFormTemplate(
        formTemplateId: string,
        requestBody: UpdateFormTemplate_In,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/form-templates/{form_template_id}',
            path: {
                'form_template_id': formTemplateId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Delete Form Template
     * Delete the response template for the current user
     * @param formTemplateId Form template id
     * @returns void
     * @throws ApiError
     */
    public static deleteFormTemplate(
        formTemplateId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/form-templates/{form_template_id}',
            path: {
                'form_template_id': formTemplateId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Published Form Template
     * Get the response template for the current user
     * @param formTemplateId Form template id
     * @returns GetFormTemplate_Out Successful Response
     * @throws ApiError
     */
    public static getPublishedFormTemplate(
        formTemplateId: string,
    ): CancelablePromise<GetFormTemplate_Out> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/form-templates/published/{form_template_id}',
            path: {
                'form_template_id': formTemplateId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Subscribe Form Template
     * Subscribe the form email notifications for the current user
     * @param formTemplateId Form template id
     * @returns void
     * @throws ApiError
     */
    public static subscribeFormTemplate(
        formTemplateId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/form-templates/{form_template_id}/subscribe',
            path: {
                'form_template_id': formTemplateId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Unsubscribe Form Template
     * Unsubscribe the form email notifications for the current user
     * @param formTemplateId Form template id
     * @returns void
     * @throws ApiError
     */
    public static unsubscribeFormTemplate(
        formTemplateId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/form-templates/{form_template_id}/unsubscribe',
            path: {
                'form_template_id': formTemplateId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Publish Form Template
     * Update the response template state for the current user
     * @param formTemplateId Form template id
     * @returns void
     * @throws ApiError
     */
    public static publishFormTemplate(
        formTemplateId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/form-templates/{form_template_id}/publish',
            path: {
                'form_template_id': formTemplateId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

}