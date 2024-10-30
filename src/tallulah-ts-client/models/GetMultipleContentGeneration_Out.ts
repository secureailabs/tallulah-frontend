/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { GetContentGeneration_Out } from './GetContentGeneration_Out';

export type GetMultipleContentGeneration_Out = {
    content_generations: Array<GetContentGeneration_Out>;
    count: number;
    limit: number;
    next: number;
};
