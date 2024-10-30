/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { FormFieldTypes } from './FormFieldTypes';

export type FormField = {
    name: string;
    label: string;
    description?: (string | null);
    place_holder?: string;
    type?: FormFieldTypes;
    required?: boolean;
    options?: Array<string>;
    private?: (boolean | null);
};
