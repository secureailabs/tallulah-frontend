/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { GetFormData_Out } from './GetFormData_Out';

export type GetMultipleFormData_Out = {
    form_data: Array<GetFormData_Out>;
    count: number;
    next: number;
    limit: number;
};
