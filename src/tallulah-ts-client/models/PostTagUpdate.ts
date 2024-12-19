/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PostState } from './PostState';

export type PostTagUpdate = {
    status?: (PostState | null);
    contact_method?: (string | null);
    contacted_at?: (string | null);
    contacted_by?: (string | null);
};
