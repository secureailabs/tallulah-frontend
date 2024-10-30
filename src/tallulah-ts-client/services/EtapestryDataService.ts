/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GetETapestryData_Out } from '../models/GetETapestryData_Out';
import type { GetMultipleETapestryData_Out } from '../models/GetMultipleETapestryData_Out';
import type { UpdateETapestryData_In } from '../models/UpdateETapestryData_In';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class EtapestryDataService {

    /**
     * Get All Etapestry Data
     * Get all the eTapestry data for the current user for the respository
     * @param repositoryId Form template id
     * @param skip Number of emails to skip
     * @param limit Number of emails to return
     * @param sortKey Sort key
     * @param sortDirection Sort direction
     * @returns GetMultipleETapestryData_Out Successful Response
     * @throws ApiError
     */
    public static getAllEtapestryData(
        repositoryId: string,
        skip?: number,
        limit: number = 200,
        sortKey: string = 'creation_time',
        sortDirection: number = -1,
    ): CancelablePromise<GetMultipleETapestryData_Out> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/etapestry-data/',
            query: {
                'repository_id': repositoryId,
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
     * Search Etapestry Data
     * Search the text eTapestry data for the current user for the template
     * @param repositoryId Form template id
     * @param searchQuery Search query
     * @param skip Number of etapestry data to skip
     * @param limit Number of etapestry data to return
     * @returns any Successful Response
     * @throws ApiError
     */
    public static searchEtapestryData(
        repositoryId: string,
        searchQuery: string,
        skip?: number,
        limit: number = 10,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/etapestry-data/search',
            query: {
                'repository_id': repositoryId,
                'search_query': searchQuery,
                'skip': skip,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Etapestry Data
     * Get the response data for the eTapestry
     * @param etapestryDataId eTapestry data id
     * @returns GetETapestryData_Out Successful Response
     * @throws ApiError
     */
    public static getEtapestryData(
        etapestryDataId: string,
    ): CancelablePromise<GetETapestryData_Out> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/etapestry-data/{etapestry_data_id}',
            path: {
                'etapestry_data_id': etapestryDataId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update Etapestry Data
     * Update the metadata for the eTapestry data
     * @param etapestryDataId eTapestry data id
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static updateEtapestryData(
        etapestryDataId: string,
        requestBody: UpdateETapestryData_In,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/etapestry-data/{etapestry_data_id}',
            path: {
                'etapestry_data_id': etapestryDataId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Delete Etapestry Data
     * Delete the response template for the current user
     * @param etapestryDataId eTapestry data id
     * @returns void
     * @throws ApiError
     */
    public static deleteEtapestryData(
        etapestryDataId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/etapestry-data/{etapestry_data_id}',
            path: {
                'etapestry_data_id': etapestryDataId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

}