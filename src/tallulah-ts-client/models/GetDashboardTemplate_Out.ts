/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DashboardLayout_Output } from './DashboardLayout_Output';
import type { DashboardTemplateState } from './DashboardTemplateState';

export type GetDashboardTemplate_Out = {
    name: string;
    description?: (string | null);
    repository_id: string;
    layout?: DashboardLayout_Output;
    id: string;
    creation_time?: string;
    state: DashboardTemplateState;
    last_edit_time?: string;
};
