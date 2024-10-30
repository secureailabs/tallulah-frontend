/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GetContentGeneration_Out } from '../models/GetContentGeneration_Out';
import type { GetMultipleContentGeneration_Out } from '../models/GetMultipleContentGeneration_Out';
import type { RegisterContentGeneration_In } from '../models/RegisterContentGeneration_In';
import type { RegisterContentGeneration_Out } from '../models/RegisterContentGeneration_Out';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ContentGenerationsService {

    /**
     * Create Content Generation
     * Create a new content generation record
     * @param requestBody
     * @returns RegisterContentGeneration_Out Successful Response
     * @throws ApiError
     */
    public static createContentGeneration(
        requestBody: RegisterContentGeneration_In,
    ): CancelablePromise<RegisterContentGeneration_Out> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/content-generations/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get All Content Generations
     * Get all content generation records for a user
     * @param contentGenerationTemplateId Content generation template id
     * @param skip Skip the first N records
     * @param limit Limit the number of records
     * @param sortKey Sort key
     * @param sortDirection Sort direction
     * @returns GetMultipleContentGeneration_Out Successful Response
     * @throws ApiError
     */
    public static getAllContentGenerations(
        contentGenerationTemplateId: string,
        skip?: number,
        limit: number = 50,
        sortKey: string = 'creation_time',
        sortDirection: number = -1,
    ): CancelablePromise<GetMultipleContentGeneration_Out> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/content-generations/',
            query: {
                'content_generation_template_id': contentGenerationTemplateId,
                'skip': skip,
                'limit': limit,
                'sort_key': sortKey,
                'sort_direction': sortDirection,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Content Generation
     * Get a specific content generation record
     * @param contentGenerationId Content generation record id
     * @returns GetContentGeneration_Out Successful Response
     * @throws ApiError
     */
    public static getContentGeneration(
        contentGenerationId: string,
    ): CancelablePromise<GetContentGeneration_Out> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/content-generations/{content_generation_id}',
            path: {
                'content_generation_id': contentGenerationId,
            },
            errors: {
                404: `Content generation not found`,
                422: `Validation Error`,
            },
        });
    }

    /**
     * Retry Content Generation
     * Retry a failed content generation record
     * @param contentGenerationId Content generation record id
     * @returns any Successful Response
     * @throws ApiError
     */
    public static retryContentGeneration(
        contentGenerationId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/content-generations/{content_generation_id}/retry',
            path: {
                'content_generation_id': contentGenerationId,
            },
            errors: {
                404: `Content generation not found`,
                422: `Validation Error`,
            },
        });
    }

}