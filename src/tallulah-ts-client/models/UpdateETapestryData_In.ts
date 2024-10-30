/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ETapestryDataState } from './ETapestryDataState';

export type UpdateETapestryData_In = {
    state?: (ETapestryDataState | null);
    notes?: (string | null);
    tags?: (Array<string> | null);
    photos?: (Array<string> | null);
    videos?: (Array<string> | null);
};
