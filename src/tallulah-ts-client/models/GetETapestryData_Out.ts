/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AccountInfo } from './AccountInfo';
import type { ETapestryDataState } from './ETapestryDataState';

export type GetETapestryData_Out = {
    repository_id: string;
    account: AccountInfo;
    state?: ETapestryDataState;
    notes?: (string | null);
    tags?: (Array<string> | null);
    photos?: (Array<string> | null);
    videos?: (Array<string> | null);
    id: string;
    creation_time?: string;
};
