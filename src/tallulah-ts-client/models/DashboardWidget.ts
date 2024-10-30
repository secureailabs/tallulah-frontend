/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DashboardWidgetTypes } from './DashboardWidgetTypes';

export type DashboardWidget = {
    name: string;
    description?: (string | null);
    type: DashboardWidgetTypes;
    data_query: any;
};
