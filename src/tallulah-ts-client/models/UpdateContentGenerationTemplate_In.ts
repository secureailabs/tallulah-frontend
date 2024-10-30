/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Context } from './Context';
import type { ParameterField } from './ParameterField';

export type UpdateContentGenerationTemplate_In = {
    name?: (string | null);
    description?: (string | null);
    parameters?: (Array<ParameterField> | null);
    context?: (Array<Context> | null);
    prompt?: (string | null);
};
