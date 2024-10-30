/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GetMultiplePatientProfileRepository_Out } from '../models/GetMultiplePatientProfileRepository_Out';
import type { GetPatientProfileRepository_Out } from '../models/GetPatientProfileRepository_Out';
import type { RegisterPatientProfileRepository_In } from '../models/RegisterPatientProfileRepository_In';
import type { RegisterPatientProfileRepository_Out } from '../models/RegisterPatientProfileRepository_Out';
import type { UpdatePatientProfileRepository_In } from '../models/UpdatePatientProfileRepository_In';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class PatientProfileRepositoriesService {

    /**
     * Get All Patient Profile Repositories
     * Get all patient profile repositories for the current user
     * @returns GetMultiplePatientProfileRepository_Out Successful Response
     * @throws ApiError
     */
    public static getAllPatientProfileRepositories(): CancelablePromise<GetMultiplePatientProfileRepository_Out> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/patient-profile-repositories/',
        });
    }

    /**
     * Add New Patient Profile Repository
     * Add a new patient profile repository
     * @param requestBody
     * @returns RegisterPatientProfileRepository_Out Successful Response
     * @throws ApiError
     */
    public static addNewPatientProfileRepository(
        requestBody: RegisterPatientProfileRepository_In,
    ): CancelablePromise<RegisterPatientProfileRepository_Out> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/patient-profile-repositories/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Patient Profile Repository
     * Get a specific patient profile repository for the current user
     * @param patientProfileRepositoryId Patient profile repository id
     * @returns GetPatientProfileRepository_Out Successful Response
     * @throws ApiError
     */
    public static getPatientProfileRepository(
        patientProfileRepositoryId: string,
    ): CancelablePromise<GetPatientProfileRepository_Out> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/patient-profile-repositories/{patient_profile_repository_id}',
            path: {
                'patient_profile_repository_id': patientProfileRepositoryId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update Patient Profile Repository
     * Update a patient profile repository for the current user
     * @param patientProfileRepositoryId Patient profile repository id
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static updatePatientProfileRepository(
        patientProfileRepositoryId: string,
        requestBody: UpdatePatientProfileRepository_In,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/patient-profile-repositories/{patient_profile_repository_id}',
            path: {
                'patient_profile_repository_id': patientProfileRepositoryId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Delete Patient Profile Repository
     * Delete a patient profile repository for the current user
     * @param patientProfileRepositoryId Patient profile repository id
     * @returns void
     * @throws ApiError
     */
    public static deletePatientProfileRepository(
        patientProfileRepositoryId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/patient-profile-repositories/{patient_profile_repository_id}',
            path: {
                'patient_profile_repository_id': patientProfileRepositoryId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

}