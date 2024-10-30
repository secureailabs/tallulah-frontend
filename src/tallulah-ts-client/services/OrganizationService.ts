/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ExportData_Db } from '../models/ExportData_Db';
import type { ExportData_Out } from '../models/ExportData_Out';
import type { GetStorageUrl_Out } from '../models/GetStorageUrl_Out';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class OrganizationService {

    /**
     * Regenerate Themes
     * Regenerate organization themes
     * @returns string Successful Response
     * @throws ApiError
     */
    public static regenerateThemes(): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/organization/themes/regenerate',
            errors: {
                404: `No templates found for the organization`,
            },
        });
    }

    /**
     * Export Organization Data
     * Export organization data
     * @param exportType Export Type - csv or json
     * @returns ExportData_Db Successful Response
     * @throws ApiError
     */
    public static exportOrganizationData(
        exportType: string,
    ): CancelablePromise<ExportData_Db> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/organization/export/{export_type}',
            path: {
                'export_type': exportType,
            },
            errors: {
                400: `Invalid export type. Supported types are csv and json`,
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Export Status
     * Get export status
     * @param exportId Export ID
     * @returns ExportData_Out Successful Response
     * @throws ApiError
     */
    public static getExportStatus(
        exportId: string,
    ): CancelablePromise<ExportData_Out> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/organization/export/{export_id}',
            path: {
                'export_id': exportId,
            },
            errors: {
                404: `Export not found`,
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get All Export Status
     * Get list of all exports & status
     * @returns ExportData_Out Successful Response
     * @throws ApiError
     */
    public static getAllExportStatus(): CancelablePromise<Array<ExportData_Out>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/organization/export',
        });
    }

    /**
     * Download Export
     * Get export status
     * @param exportId Export ID
     * @returns GetStorageUrl_Out Successful Response
     * @throws ApiError
     */
    public static downloadExport(
        exportId: string,
    ): CancelablePromise<GetStorageUrl_Out> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/organization/export/{export_id}/download',
            path: {
                'export_id': exportId,
            },
            errors: {
                404: `Export not found`,
                422: `Validation Error`,
            },
        });
    }

}