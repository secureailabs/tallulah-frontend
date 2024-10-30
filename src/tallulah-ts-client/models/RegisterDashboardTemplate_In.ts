/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DashboardLayout_Input } from './DashboardLayout_Input';

export type RegisterDashboardTemplate_In = {
    name: string;
    description?: (string | null);
    repository_id: string;
    layout?: DashboardLayout_Input;
};
