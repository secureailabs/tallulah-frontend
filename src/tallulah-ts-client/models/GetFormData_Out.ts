/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { FormDataMetadata } from './FormDataMetadata';
import type { FormDataState } from './FormDataState';

export type GetFormData_Out = {
    form_template_id: string;
    values?: any;
    id: string;
    state?: FormDataState;
    themes?: (Array<string> | null);
    metadata?: (FormDataMetadata | null);
    creation_time: string;
};
