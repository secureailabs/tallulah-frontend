/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { GetETapestryData_Out } from './GetETapestryData_Out';

export type GetMultipleETapestryData_Out = {
    etapestry_data: Array<GetETapestryData_Out>;
    count: number;
    next: number;
    limit: number;
};
