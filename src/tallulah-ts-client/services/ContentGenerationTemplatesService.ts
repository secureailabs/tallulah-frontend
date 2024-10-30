/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GetContentGenerationTemplate_Out } from '../models/GetContentGenerationTemplate_Out';
import type { GetMultipleContentGenerationTemplate_Out } from '../models/GetMultipleContentGenerationTemplate_Out';
import type { RegisterContentGenerationTemplate_In } from '../models/RegisterContentGenerationTemplate_In';
import type { RegisterContentGenerationTemplate_Out } from '../models/RegisterContentGenerationTemplate_Out';
import type { UpdateContentGenerationTemplate_In } from '../models/UpdateContentGenerationTemplate_In';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ContentGenerationTemplatesService {

    /**
     * Get All Content Generation Templates
     * Get all content generation templates for the current user
     * @returns GetMultipleContentGenerationTemplate_Out Successful Response
     * @throws ApiError
     */
    public static getAllContentGenerationTemplates(): CancelablePromise<GetMultipleContentGenerationTemplate_Out> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/content-generation-templates/',
        });
    }

    /**
     * Add New Content Generation Template
     * Add a new content generation template
     * @param requestBody
     * @returns RegisterContentGenerationTemplate_Out Successful Response
     * @throws ApiError
     */
    public static addNewContentGenerationTemplate(
        requestBody: RegisterContentGenerationTemplate_In,
    ): CancelablePromise<RegisterContentGenerationTemplate_Out> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/content-generation-templates/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Content Generation Template
     * Get a specific content generation template for the current user
     * @param contentGenerationTemplateId Content generation template id
     * @returns GetContentGenerationTemplate_Out Successful Response
     * @throws ApiError
     */
    public static getContentGenerationTemplate(
        contentGenerationTemplateId: string,
    ): CancelablePromise<GetContentGenerationTemplate_Out> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/content-generation-templates/{content_generation_template_id}',
            path: {
                'content_generation_template_id': contentGenerationTemplateId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update Content Generation Template
     * Update a content generation template for the current user
     * @param contentGenerationTemplateId Content generation template id
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static updateContentGenerationTemplate(
        contentGenerationTemplateId: string,
        requestBody: UpdateContentGenerationTemplate_In,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/content-generation-templates/{content_generation_template_id}',
            path: {
                'content_generation_template_id': contentGenerationTemplateId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Delete Content Generation Template
     * Delete a content generation template for the current user
     * @param contentGenerationTemplateId Content generation template id
     * @returns void
     * @throws ApiError
     */
    public static deleteContentGenerationTemplate(
        contentGenerationTemplateId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/content-generation-templates/{content_generation_template_id}',
            path: {
                'content_generation_template_id': contentGenerationTemplateId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

}