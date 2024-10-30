/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ParametersType } from './ParametersType';

export type ParameterField = {
    name: string;
    label: string;
    description?: (string | null);
    place_holder?: string;
    type?: ParametersType;
    required?: boolean;
    options?: Array<string>;
};
