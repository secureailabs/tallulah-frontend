/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GetDashboardTemplate_Out } from '../models/GetDashboardTemplate_Out';
import type { RegisterDashboardTemplate_In } from '../models/RegisterDashboardTemplate_In';
import type { RegisterDashboardTemplate_Out } from '../models/RegisterDashboardTemplate_Out';
import type { UpdateDashboardTemplate_In } from '../models/UpdateDashboardTemplate_In';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class DashboardTemplatesService {

    /**
     * Add New Dashboard Template
     * Add a new dashboard template
     * @param requestBody
     * @returns RegisterDashboardTemplate_Out Successful Response
     * @throws ApiError
     */
    public static addNewDashboardTemplate(
        requestBody: RegisterDashboardTemplate_In,
    ): CancelablePromise<RegisterDashboardTemplate_Out> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/dashboard-templates/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Dashboard Templates
     * Get the dashboard templates for the current user
     * @param respositoryId Repository id to filter the dashboard templates
     * @returns GetDashboardTemplate_Out Successful Response
     * @throws ApiError
     */
    public static getDashboardTemplates(
        respositoryId: string,
    ): CancelablePromise<Array<GetDashboardTemplate_Out>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/dashboard-templates/',
            query: {
                'respository_id': respositoryId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Dashboard Template
     * Get the dashboard template for the current user
     * @param dashboardTemplateId Dashboard template id
     * @returns GetDashboardTemplate_Out Successful Response
     * @throws ApiError
     */
    public static getDashboardTemplate(
        dashboardTemplateId: string,
    ): CancelablePromise<GetDashboardTemplate_Out> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/dashboard-templates/{dashboard_template_id}',
            path: {
                'dashboard_template_id': dashboardTemplateId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update Dashboard Template
     * Update the dashboard template for the current user
     * @param dashboardTemplateId Dashboard template id
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static updateDashboardTemplate(
        dashboardTemplateId: string,
        requestBody: UpdateDashboardTemplate_In,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/dashboard-templates/{dashboard_template_id}',
            path: {
                'dashboard_template_id': dashboardTemplateId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Delete Dashboard Template
     * Delete the dashboard template for the current user
     * @param dashboardTemplateId Dashboard template id
     * @returns void
     * @throws ApiError
     */
    public static deleteDashboardTemplate(
        dashboardTemplateId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/dashboard-templates/{dashboard_template_id}',
            path: {
                'dashboard_template_id': dashboardTemplateId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Execute Dashboard Template
     * Execute the queries in the dashboard template
     * @param dashboardTemplateId Dashboard template id
     * @param repositoryId Repository id
     * @returns any Successful Response
     * @throws ApiError
     */
    public static executeDashboardTemplate(
        dashboardTemplateId?: (string | null),
        repositoryId?: (string | null),
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/dashboard-templates/execute',
            query: {
                'dashboard_template_id': dashboardTemplateId,
                'repository_id': repositoryId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

}