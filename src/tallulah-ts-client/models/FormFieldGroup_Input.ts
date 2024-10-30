/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { FormField } from './FormField';

export type FormFieldGroup_Input = {
    name: string;
    description?: (string | null);
    fields?: Array<FormField>;
};
