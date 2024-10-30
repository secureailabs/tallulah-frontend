/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ExportState } from './ExportState';
import type { ExportType } from './ExportType';

export type ExportData_Out = {
    user_id: string;
    organization_id: string;
    export_type: ExportType;
    status?: ExportState;
    request_time?: string;
    export_time?: string;
    filename?: (string | null);
    id: string;
};
