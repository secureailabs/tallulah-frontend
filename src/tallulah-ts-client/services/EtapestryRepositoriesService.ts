/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GetETapestryRepository_Out } from '../models/GetETapestryRepository_Out';
import type { GetMultipleETapestryRepository_Out } from '../models/GetMultipleETapestryRepository_Out';
import type { RegisterETapestryRepository_In } from '../models/RegisterETapestryRepository_In';
import type { RegisterETapestryRepository_Out } from '../models/RegisterETapestryRepository_Out';
import type { UpdateETapestryRepository_In } from '../models/UpdateETapestryRepository_In';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class EtapestryRepositoriesService {

    /**
     * Get All Etapestry Repositories
     * Get all the eTapestry respositories for the current user
     * @returns GetMultipleETapestryRepository_Out Successful Response
     * @throws ApiError
     */
    public static getAllEtapestryRepositories(): CancelablePromise<GetMultipleETapestryRepository_Out> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/etapestry-repositories/',
        });
    }

    /**
     * Add New Etapestry Repository
     * Add a new eTapestry repository
     * @param requestBody
     * @returns RegisterETapestryRepository_Out Successful Response
     * @throws ApiError
     */
    public static addNewEtapestryRepository(
        requestBody: RegisterETapestryRepository_In,
    ): CancelablePromise<RegisterETapestryRepository_Out> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/etapestry-repositories/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Etapestry Repository
     * Get the eTapestry respository for the current user
     * @param etapestryRepositoryId eTapestry repository id
     * @returns GetETapestryRepository_Out Successful Response
     * @throws ApiError
     */
    public static getEtapestryRepository(
        etapestryRepositoryId: string,
    ): CancelablePromise<GetETapestryRepository_Out> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/etapestry-repositories/{etapestry_repository_id}',
            path: {
                'etapestry_repository_id': etapestryRepositoryId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update Etapestry Repository
     * Update the eTapestry respository for the current user
     * @param etapestryRepositoryId eTapestry repository id
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static updateEtapestryRepository(
        etapestryRepositoryId: string,
        requestBody: UpdateETapestryRepository_In,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/etapestry-repositories/{etapestry_repository_id}',
            path: {
                'etapestry_repository_id': etapestryRepositoryId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Delete Etapestry Repository
     * Delete the eTapestry respository for the current user
     * @param etapestryRepositoryId eTapestry repository id
     * @returns void
     * @throws ApiError
     */
    public static deleteEtapestryRepository(
        etapestryRepositoryId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/etapestry-repositories/{etapestry_repository_id}',
            path: {
                'etapestry_repository_id': etapestryRepositoryId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Refresh Etapestry Repository
     * Refresh the eTapestry respository for the current user
     * @param etapestryRepositoryId eTapestry repository id
     * @returns any Successful Response
     * @throws ApiError
     */
    public static refreshEtapestryRepository(
        etapestryRepositoryId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/etapestry-repositories/{etapestry_repository_id}/refresh',
            path: {
                'etapestry_repository_id': etapestryRepositoryId,
            },
            errors: {
                405: `Too soon. Refresh is only allowed after 1 hour`,
                422: `Validation Error`,
            },
        });
    }

}