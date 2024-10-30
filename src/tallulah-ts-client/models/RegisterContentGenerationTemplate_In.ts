/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Context } from './Context';
import type { ParameterField } from './ParameterField';

export type RegisterContentGenerationTemplate_In = {
    name: string;
    description?: (string | null);
    parameters?: Array<ParameterField>;
    context?: Array<Context>;
    prompt: string;
};
